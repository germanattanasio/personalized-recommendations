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

var watson = require('watson-developer-cloud');
var request = require('request');
var fs = require('fs');

// username and password from VCAP_SERVICES
var username = '<concept-insights-username>';
var password = '<concept-insights-password>';


// corpus path /corpora/{account_id}/{corpus_name}
var corpusPath = '/corpora/laret4ry9in5/locations';
var wikipediaApi = 'https://en.wikipedia.org/w/api.php';

// service wrapper
var conceptInsights = watson.concept_insights({
  version: 'v2',
  username: username,
  password: password
});

//create the corpus
conceptInsights.corpora.createCorpus({
  corpus:  corpusPath,
  access: 'public'
}, function(err) {
  if (err)
    return console.log('Error creating the corpus:', err);

  loadCorpus();
});


// load the corpus with the places
var loadCorpus = function() {
  // read sync
  var places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
  places.forEach(addPlacetoCorpus(username, corpusPath));
};

var addPlacetoCorpus = function(username, corpus) {
  return function(place) {
    request.get({
      url: wikipediaApi,
      qs: {
        format: 'json',
        action: 'query',
        prop: 'extracts',
        explaintext: true,
        titles: place.name,
      }
    }, function(error, response, body) {
      var newDocument = {
        id: corpus + '/documents/' + place.key,
        document: {
          id: place.key,
          label: place.name,
          parts: [{
            name: place.name,
            data: body
          }]
        }
      };
      //console.log(newDocument);
      conceptInsights.corpora.createDocument(newDocument, function(err) {
        if (err)
          return console.log(err);
        console.log('document created:', newDocument);
      });
    });
  };
};

//loadCorpus();