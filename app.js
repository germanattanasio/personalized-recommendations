/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express');
var app = express();
qvar watson = require('watson-developer-cloud');
var extend = require('util')._extend;
var fs = require('fs');

// Bootstrap application settings
require('./config/express')(app);

var username = '<username>';
var password = '<password>';
var corpus = 'locations';
var problem = JSON.parse(fs.readFileSync('data/problem.json', 'utf8'));
var places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
var publicCorpusUsername = '30ac56d5-0f6e-43dc-9282-411972b2e11f';

var conceptInsights = watson.concept_insights({
  version: 'v1',
  username: username,
  password: password
});

var questionAndAnswer = watson.question_and_answer({
  version: 'v1',
  username: username,
  password: password,
  dataset: 'travel'
});

var tradeoffAnalytics = watson.tradeoff_analytics({
  version: 'v1',
  username: username,
  password: password
});

app.get('/', function(req, res) {
  res.render('index');
});

// concept insights REST calls
app.get('/label_search', function(req, res, next) {
  var payload = extend({
    corpus: corpus,
    user: publicCorpusUsername,
    func: 'labelSearch',
    limit: 4,
    prefix: true,
    concepts: true,
  }, req.query);

  conceptInsights.labelSearch(payload, function(err, results) {
    if (err)
      return next(err);
    else {
      return res.json((results || []).map(function normalize(item) {
        if (item.type === 'concept') {
          item.id = '/graph/wikipedia/en-20120601/' + item.id; // if concept
          item.type = 'Concept';
        } else {
          item.id = '/corpus/' + publicCorpusUsername + '/' + corpus + '/' + item.id; // if is a location
          item.type = 'Location';
        }
        return item;
      }));
    }
  });
});

app.get('/semantic_search', function(req, res, next) {
  var payload = extend({
    corpus: corpus,
    user: publicCorpusUsername,
    func: 'semanticSearch',
  }, req.query);

  // ids needs to be stringify
  payload.ids = JSON.stringify(payload.ids);

  conceptInsights.semanticSearch(payload, function(err, results) {
    if (err)
      return next(err);
    else
      return res.json(results ? results.results : []);
  });
});

// tradeoff analytics REST call
app.post('/dilemmas', function(req, res, next) {
  tradeoffAnalytics.dilemmas(req.body, function(err, dilemmas) {
    if (err)
      return next(err);
    else
      return res.json(dilemmas);
  });
});

// question and answer REST call
app.get('/ask_question', function(req, res, next) {
  questionAndAnswer.ask(req.query, function(err, pipelines) {
    if (err)
      return next(err);
    else {
      return res.json(pipelines[0].question.evidencelist);
    }
  });
});

app.get('/get_problem', function(req, res) {
  // locations resulting from concept insights
  var locations = req.query.locations;

  // filter to only the locations we want to analyze
  problem.options = places.filter(function(place) {
    return locations.indexOf(place.key) !== -1;
  });

  res.json(problem);
});

app.post('/destination', function(req, res) {
  res.render('destination', JSON.parse(req.body.place || {}) );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.code = 404;
  err.message = 'Not Found';
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  var error = {
    code: err.code || 500,
    error: err.message || err.error
  };
  res.status(err.code).json(err);
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);