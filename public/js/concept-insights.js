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

var global = {
  places: []
};

$(document).ready(function() {
  // variables
  var $loading = $('.loading');
  var $result = $('.result');
  var $noresult = $('.noresult');
  var $locations = $('.locations');
  var $query = $('.query');
  var $errorMsg = $('.errorMsg');
  var $tagContainer = $('.tags-container');

  // get results query
  var getResults = function(ids, callback) {
    $result.hide();
    $noresult.hide();

    if (ids && ids.length === 0)
      return;

    $loading.show();
    $.get('semantic_search', { ids: ids, limit: 9 }, callback);
  };

  // on success, load results into html
  var loadResults = function(results) {
    $loading.hide();
    //save the results in a global variable
    global.places = results;
    populateResults(results);
  };

  // update the text input placeholder if there are tags selected
  var updateInputPlaceholder = function() {
    var tags = getIdsFromTags();
    if (tags && tags.length > 0) {
      $query.attr('placeholder', 'Add more concepts...');
    } else {
      $query.attr('placeholder', ' Try "snorkel" or "beach"');
    }
  };

  // return array of ids from .tag-text
  var getIdsFromTags = function() {
    var dataIds = [];
    $('.tag-text').each(function() {
      dataIds.push($(this).data('id'));
    });
    return dataIds;
  };

  var createTag = function(id, name) {
    var aLink = $('<a></a>')
      .addClass('tag-close')
      .attr('href', '#')
      .append('&times;');

    var tag = $('<span></span>')
      .addClass('tag-text')
      .attr('data-id', id)
      .append(name)
      .append(aLink);
    return tag;
  };

  $(document).on('click', '.tag-close', function() {
    $(this).parent().remove();
    updateInputPlaceholder();
    getResults(getIdsFromTags(), loadResults);
  });

  $(document).ajaxError(function(event, request) {
    $loading.hide();
    if (request.status == 500) {
      $errorMsg.show();
    }
  });

  // populate results
  var populateResults = function(results) {
    $locations.empty();

    // check if empty results
    if (results.length === 0) {
      $noresult.show();
      return;
    }

    // for each location
    $.each(results, function(_, location) {
      var locationTemplate = $('.location-template').first().clone();
      locationTemplate.find('.employee-card').prop('data-id', location.id);
      locationTemplate.find('.expert-name').text(location.label);
      locationTemplate.find('.expert-score').text((Math.round(location.score * 1000) / 1000) * 100 + '%');

      var expertises = locationTemplate.find('.expertise');
      expertises.empty();
      // for each tag
      $.each(location.tags.slice(0,5), function(_, tag) {
        var concept = tag.concept;
        var name = concept.split('/').slice(4).join('/').replace(/_/g, ' ');

        $('<a/>', {
          'class': 'expertise-tag',
          'href': 'javascript:void(0);',
          'title': name,
          'data-id': concept,
          'data-name': name
        }).append(name).appendTo($('<li/>').appendTo(expertises));
      });
      $locations.append(locationTemplate);
      locationTemplate.show();
    });
    $result.show();
  };

  $(document).on('click', '.expertise-tag', function() {
    var data = $(this).data();
    var existingTags = getIdsFromTags();
    if ($.inArray(data.id, existingTags) !== -1)
      return;

    var newTag = createTag(data.id, data.name);
    $tagContainer.append(newTag);
    setTimeout(function() {
      $(newTag).addClass('load-in');
    }, 100);
    updateInputPlaceholder();
    getResults(getIdsFromTags(), loadResults);
  });

  var concepts = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: '../label_search?query=%QUERY'
  });

  concepts.initialize();

  $('#remote .typeahead').typeahead({
    minLength: 3,
    hint: false
  }, {
    name: 'label_search',
    displayKey: 'label',
    source: concepts.ttAdapter(),
    templates: {
      empty: '<div class="noresult"><h4>No results found</h4></div>',
      suggestion: Handlebars.compile('<li> ' +
        '<h4 class="concept-name" title="{{label}}">{{label}}</h4> ' +
        '<span class="concept-type type-{{type}}">({{type}})</span> ' +
        '<p class="more-info" title="{{result.abstract}}">{{result.abstract}}</p> ' +
        '</li>')
    }
  });

  // typeahead result - onclick
  $('#remote .typeahead').bind('typeahead:selected', function(obj, data) {
    if (!data.id)
      return;

    var newTag = createTag(data.id, data.label);
    $tagContainer.append(newTag);
    // apply load-in 100 ms from now
    setTimeout(function() {
      $(newTag).addClass('load-in');
    }, 100);
    updateInputPlaceholder();
    // locations
    getResults(getIdsFromTags(), loadResults);

    // clearing typeahead
    $('.typeahead').typeahead('val', '');
  });
});