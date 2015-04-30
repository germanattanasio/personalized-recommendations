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
/*global $:false */

'use strict';

$(document).ready(function() {
  // question and Answer controllers

  var $answers = $('.answers');
  var $loadingAnswers = $('.loading-answers');

  $('.question').keypress(function(e) {
    if (e.which === 13) {
      askWatson();
    }
  });

  var populateAnswers = function(answers) {
    $loadingAnswers.hide();
    $.each(answers.slice(0, 3), function(index, answer) {
      var text = answer.text.replace(/\s+/g, ' ');
      text = text.length <= 300 ? text : text.substring(0, 300) + '...';
      $('<div class="col-lg-12 col-xs-12">')
        .append($('<p class="answer-text">').text((index+1) + ') ' + text))
        .appendTo($answers);
    });
  };

  var askWatson = function() {
    $loadingAnswers.show();
    $answers.empty();
    $.get('ask_question', {
      text: $('.question').val(),
      items: 3
    }, populateAnswers);
  };

  var exampleQuestions = [
    'Do I need a visa to enter Brazil?',
    'How much should I tip a taxi in Argentina?',
    'Where is the best place to dive in Austrlia?',
    'How high is Mount Everest?',
    'How deep is the Grand Canyon?',
    'When is the rainy season in Bangalore?'
  ];

  $('.example-question').click(function() {
    var index = Math.floor(Math.random() * exampleQuestions.length);
    $('.question').val(exampleQuestions[index]);
    askWatson();
  });

});