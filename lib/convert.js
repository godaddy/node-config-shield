var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

module.exports = convert;

function convert (options, cb) {
  var instance = this;

  options = options || {};
  options.alg = options.alg || 'aes-256-ctr';

  var convertAllProperties = function(oldPwd, newPwd) {
    var keys = instance.getKeys();
    keys.forEach(function(k) {
      var v = instance.getProp(k, oldPwd);
      instance.setProp(k, v, options.alg, newPwd);
    });
  };

  var privateKey = options.privateKeyPath || instance.config._.privateKeyPath;

  if (typeof cb === 'function') {
    if (typeof privateKey !== 'string') {
      return void cb(new Error('options.privateKeyPath required'));
    }

    var fullPrivateKeyPath = path.resolve(privateKey);

    fs.readFile(fullPrivateKeyPath, { encoding: 'utf8' }, function (err, newPwd) {
      if (err) {
        return void cb(err);
      }

      convertAllProperties(instance.pwd, newPwd);

      instance.config._.privateKeyPath = fullPrivateKeyPath;
      instance.pwd = newPwd;

      return void cb(null, instance);
    });
  } else {
    if (typeof privateKey !== 'string') {
      throw new Error('options.privateKeyPath required');
    }

    var fullPrivateKeyPath = path.resolve(privateKey);

    var newPwd = fs.readFileSync(fullPrivateKeyPath, { encoding: 'utf8' });

    convertAllProperties(instance.pwd, newPwd);

    instance.config._.privateKeyPath = fullPrivateKeyPath;
    instance.pwd = newPwd;
  }

  return instance;
}
