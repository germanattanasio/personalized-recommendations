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
var watson = require('watson-developer-cloud');
var extend = require('util')._extend;
var fs = require('fs');

// Bootstrap application settings
require('./config/express')(app);

var corpus = '/corpora/30ac56d5-0f6e-43dc-9282-411972b2e11f/locations';

var problem = JSON.parse(fs.readFileSync('data/problem.json', 'utf8'));
var places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));

var conceptInsights = watson.concept_insights({
  version: 'v2',
  username: '<ci-username>',
  password: '<ci-password>'
});

var questionAndAnswer = watson.question_and_answer({
  version: 'v1',
  username: '<qa-username>',
  password: '<qa-password>',
  dataset: 'travel'
});

// Tradeoff Analytics has special credentials because
// is a General Availability service.
var ta_username = '<ta-username>';
var ta_password = '<ta-password>';

var tradeoffAnalytics = watson.tradeoff_analytics({
  version: 'v1',
  username: ta_username,
  password: ta_password,
});

app.get('/', function(req, res) {
  res.render('index');
});

// concept insights REST calls
app.get('/label_search', function(req, res, next) {
  var params = extend({
    corpus: corpus,
    concept_fields: JSON.stringify({ abstract: 1, type:1, }),
    prefix: true,
    limit: 4,
    concepts: true
  }, req.query);

  conceptInsights.corpora.searchByLabel(params, function(err, results) {
    if (err)
      return next(err);
    else {
      return res.json(results.matches.map(function(match){
        match.type = match.type ? 'concept' : 'document';
        return match;
      } ));
    }
  });
});

app.get('/conceptual_search', function(req, res, next) {
  var payload = extend({
    corpus: corpus,
  }, req.query);

  // ids needs to be stringify
  payload.ids = JSON.stringify(payload.ids);

  conceptInsights.corpora.getRelatedDocuments(payload, function(err, results) {
    if (err)
      return next(err);
    else
      return res.json(results ? results.results : []);
  });
});

// tradeoff analytics REST call - here


// question and answer REST call


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
  res.status(error.code).json(error);
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
