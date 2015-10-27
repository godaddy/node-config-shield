'use strict';

var crypto = require('crypto');

module.exports = getProp;

function getProp(key, pwd) {
  if (key in this.cache) {
    return this.cache[key]; // already decrypted
  }

  if (!(key in this.config.properties)) {
    return undefined; // prop does not exist
  }

  var item = this.config.properties[key];

  var cipher = crypto.createCipher(item.alg, pwd || this.pwd);

  var dec = cipher.update(item.value, 'hex', 'utf8');
  dec += cipher.final('utf8');

  // parse it
  dec = JSON.parse(dec);

  if (this.options.noCache !== true) {
    // cache result
    this.cache[key] = dec.value;
  }

  return dec.value;
}
