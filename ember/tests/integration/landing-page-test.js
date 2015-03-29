import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var App, server;

module('Integration - Channels Page', {
  beforeEach: function() {
    App = startApp();
    var channels = [
      {
        id: 1,
        name: 'Mechanical'
      },
      {
        id: 2,
        name: 'Power'
      },
      {
        id: 3,
        name: 'Basement'
      }
    ];

    server = new Pretender(function() {
      this.get('/api/channels', function(request) {
        return [200, {"Content-Type": "application/json"}, JSON.stringify({channels: channels})];
      });

      this.get('/api/channels/:id', function(request) {
        var channel = channels.find(function(channel) {
          if (channel.id === parseInt(request.params.id, 10)) {
            return channel;
          }
        });

        return [200, {"Content-Type": "application/json"}, JSON.stringify({channel: channel})];
      });
    });

  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('Should show the page title', function(assert) {
  visit('/').then(function() {
    assert.equal(find('h2#title').text(), 'Nowatt usage page');
  });
});

test('Should list all channels', function(assert) {
  visit('/channels').then(function() {
    assert.equal(find('a:contains("Mechanical")').length, 1);
    assert.equal(find('a:contains("Power")').length, 1);
    assert.equal(find('a:contains("Basement")').length, 1);
  });
});

test('Should be able to navigate to a channel', function(assert) {
  visit('/channels').then(function() {
    click('a:contains("Mechanical")').then(function() {
      assert.equal(find('h4').text(), 'Mechanical');
    });
  });
});

test('Should be able visit a speaker page', function(assert) {
  visit('/channels/1').then(function() {
    assert.equal(find('h4').text(), 'Mechanical');
  });
});
