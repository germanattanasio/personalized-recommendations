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
var username = '<username>';
var password = '<password>';
var corpusName = 'locations';
var wikipediaApi = 'https://en.wikipedia.org/w/api.php';

// service wrapper
var conceptInsights = watson.concept_insights({
  version: 'v1',
  username: username,
  password: password
});

// create the corpus
conceptInsights.createCorpus({
  user: username,
  corpus: corpusName,
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
  places.forEach(addPlacetoCorpus(username, corpusName));
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
      console.log(body); // 200
      var _document = {
        user: username,
        corpus: corpus,
        // document data
        documentid: place.key,
        document: {
          id: place.key,
          label: place.name,
          parts: [{
            name: place.name,
            data: body
          }]
        }
      };
      conceptInsights.updateDocument(_document, function(err) {
        if (err)
          return console.log(err);

        console.log('document created:', _document);
      });
    });
  };
};

//loadCorpus();