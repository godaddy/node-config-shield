var SecureConfig = require('./secure-config');
var fs = require('fs');
var path = require('path');

module.exports = loadFromFile;

function loadFromFile (options, cb) {
  options = options || {};
  options.instance = options.instance || this.options.instance;
  options.configPath = options.configPath || './secure-config.json';

  // get instance
  var instance = this.getInstance(options.instance);

  // if requesting a different instance, create it
  if (!instance) {
    instance = new SecureConfig(options);
    this.setInstance(instance);
  }

  var fullConfigPath = path.resolve(options.configPath);

  if (typeof cb === 'function') {
    fs.readFile(fullConfigPath, { encoding: 'utf8' }, function(err, data) {
      if (err) {
        return void cb(err);
      }

      var config = JSON.parse(data);
      config._ = config._ || {};
      config.properties = config.properties || {};

      // use explicit option
      // or path in config
      // otherwise default to demo cert
      var fullPrivateKeyPath = path.resolve(
        options.privateKeyPath ||
        config._.privateKeyPath ||
        __dirname + '/../certs/demo.key'
      );

      fs.readFile(fullPrivateKeyPath, { encoding: 'utf8' }, function (err, pwd) {
        if (err) {
          return void cb(err);
        }

        instance.configPath = fullConfigPath;
        instance.config = config;
        instance.pwd = pwd;

        return void cb(null, config);
      });
    });
  } else {
    var data = fs.readFileSync(fullConfigPath, { encoding: 'utf8' });
    var config = JSON.parse(data);
    config._ = config._ || {};
    config.properties = config.properties || {};

    // use explicit option
    // or path in config
    // otherwise default to demo cert
    var fullPrivateKeyPath = path.resolve(
      options.privateKeyPath ||
      config._.privateKeyPath ||
      __dirname + '/../certs/demo.key'
    );

    var pwd = fs.readFileSync(fullPrivateKeyPath, { encoding: 'utf8' });

    instance.configPath = fullConfigPath;
    instance.config = config;
    instance.pwd = pwd;
  }

  return instance;
}
