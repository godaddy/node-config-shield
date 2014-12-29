module.exports = SecureConfig;

// init with default
var configInstances = { };

function SecureConfig (options) {
  if (!(this instanceof SecureConfig)) {
    return new SecureConfig(options);
  }

  this.options = options || {};
  this.options.instance = this.options.instance || 'default';
  this.config = { _: {}, properties: {} };
  this.cache = {};

  // track instance
  configInstances[this.options.instance] = this;
}

var p = SecureConfig.prototype;

p.getProp = require('./get-prop');

p.setProp = require('./set-prop');

p.removeProp = require('./remove-prop');

p.removeAll = require('./remove-all');

p.getKeys = require('./get-keys');

p.load = require('./load-from-file');

p.save = require('./save-to-file');

p.convert = require('./convert');

p.getInstance = function (instanceName) {
  return configInstances[instanceName];
};

p.setInstance = function (instance) {
  return configInstances[instance.options.instance] = instance;
};
