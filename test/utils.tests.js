'use strict';

var assert = require('assert');
var path   = require('path');
var utils  = require('../lib/utils');

describe('utils', function() {
    it('should be able to normalize key', function() {
      var actual = utils.normalizeKey('    this is a..    \r\ntest \n\n  ..test2   ');
      assert.equal(actual, 'this is a..test..test2');
    });
});
