import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application,
    get = Ember.get,
    controller;

module('XAutosuggest - Choose and Select from simple array', {
  beforeEach: function() {
    application = startApp();
    // FIXME: find a better way of getting to the container
    controller = application.__container__.lookup('controller:core');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('x-autosuggest DOM elements are setup', function(assert) {
  visit('/core');

  assert.expect(4);

  andThen(function() {
    assert.ok($('div.autosuggest'), "autosuggest component in view");
    assert.ok($('input.autosuggest').length, "suggestion input in DOM.");
    assert.ok($('ul.selections').length, "selections ul in DOM");
    assert.equal($('ul.suggestions').is(':visible'), false, "results ul is initially not displayed");
  });
});

test("a no results message is displayed when no match is found", function(assert){
  assert.expect(3);

  visit('/').then(function(){
    assert.equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  });

  fillIn('input.autosuggest', 'xxxx');

  andThen(function(){
    assert.ok(Ember.$('ul.suggestions').is(':visible'), "results ul is displayed.");
    assert.equal(find('.results .suggestions .no-results').html(), "No Results.", "No results message is displayed.");
  });
});


test("Search results should be filtered", function(assert){
  assert.expect(4);

  visit('/').then(function(){
    assert.equal(get(controller, 'content.length'), 3, "precon - 3 possible selections exist");

    assert.equal($('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  });

  fillIn('input.autosuggest', 'Paul');

  andThen(function(){
    var el = find('.results .suggestions li.result span');
    assert.equal(el.length, 1, "1 search result exists");
    assert.equal(el.text().trim(), "Paul Cowan", "1 search result is visible.");
  });
});

test("A selection can be added", function(assert) {
  assert.expect(6);

  assert.equal(get(controller, 'tags.length'), 0, "precon - no selections have been added.");

  visit('/');

  fillIn('input.autosuggest', 'Paul');

  click('.results .suggestions li.result');

  andThen(function(){
    assert.equal(get(controller, 'tags.length'), 1, "1 selection has been added.");

    var el = find('.selections li.selection');
    assert.equal(el.length, 1, "1 selection element has been added");

    assert.ok(/Paul Cowan/.test(el.first().text()), "Correct text displayed in element.");

    var suggestions = find('.results .suggestions li.result');

    assert.equal(suggestions.length, 0, "No suggestions are visible.");

    var noResults = find('.suggestions .no-results');

    assert.equal(noResults.is(':visible'), false, "No results message is not displayed.");
  });
});
