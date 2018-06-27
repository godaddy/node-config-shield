'use strict';

var assert       = require('assert');
var path         = require('path');
var SecureConfig = require('../lib/secure-config');

describe('convert', function() {
    it('should be able to decrypt with normalized key', function(done) {
        var instance = new SecureConfig({});

        instance.load({
          configPath: path.join(__dirname, 'specs/secure-config.json'),
          privateKeyPath: path.join(__dirname, 'specs/demo.key')
        }, function(err) {
          assert.ifError(err);

          instance.setProp('test', 'hey');
          assert.equal(instance.getProp('test'), 'hey');

          var oldPwd = instance.pwd;
          instance.convert({
              privateKeyPath: path.join(__dirname, 'specs/new.key'),
              normalizeKey: true
          }, function(err){
              assert.ifError(err);

              instance.pwd = oldPwd;
              instance.cache = {};

              assert.equal(instance.getProp('test'), 'hey');
              done();
          });
        });
    });
});
