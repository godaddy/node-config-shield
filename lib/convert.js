'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = convert;

function convert(options, cb) {
  var instance = this;

  options = options || {};
  options.alg = options.alg || 'aes-256-ctr';

  var convertAllProperties = function (oldPwd, newPwd, backupOldValue) {
    var keys = instance.getKeys();
    keys.forEach(function (k) {
      var v = instance.getProp(k, oldPwd);
      instance.setProp(k, v, options.alg, newPwd, backupOldValue);
    });
  };

  var privateKey = options.privateKeyPath || instance.config._.privateKeyPath;
  var fullPrivateKeyPath;

  if (typeof cb === 'function') {
    if (typeof privateKey !== 'string') {
      return void cb(new Error('options.privateKeyPath required'));
    }

    fullPrivateKeyPath = path.resolve(privateKey);

    fs.readFile(fullPrivateKeyPath, { encoding: 'utf8' }, function (err, newPwd) {
      if (err) {
        return void cb(err);
      }

      if (options.normalizeKey) {
        newPwd = utils.normalizeKey(newPwd);
      }
      convertAllProperties(instance.pwd, newPwd);

      instance.config._.normalizeKey = (options.normalizeKey === true);
      instance.config._.privateKeyPath = fullPrivateKeyPath;
      instance.pwd = newPwd;

      return void cb(null, instance);
    });
  } else {
    if (typeof privateKey !== 'string') {
      throw new Error('options.privateKeyPath required');
    }

    fullPrivateKeyPath = path.resolve(privateKey);

    var newPwd = fs.readFileSync(fullPrivateKeyPath, { encoding: 'utf8' });

    if (options.normalizeKey) {
      newPwd = utils.normalizeKey(newPwd);
    }

    convertAllProperties(instance.pwd, newPwd, options.backup === true);

    instance.config._.privateKeyPath = fullPrivateKeyPath;
    instance.config._.normalizeKey = (options.normalizeKey === true);
    instance.pwd = newPwd;
  }

  return instance;
}
