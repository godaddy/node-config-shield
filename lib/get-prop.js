'use strict';

var crypto = require('crypto');

module.exports = getProp;

function getValueFromItem(item, val, pwd) {
  var cipher = crypto.createCipher(item.alg, pwd);

  var dec = cipher.update(val, 'hex', 'utf8');
  dec += cipher.final('utf8');

  // parse it
  return JSON.parse(dec);
}

function getProp(key, pwd) {
  if (key in this.cache) {
    return this.cache[key]; // already decrypted
  }

  if (!(key in this.config.properties)) {
    return undefined; // prop does not exist
  }

  var item = this.config.properties[key];

  var dec;  // parse it
  try {
    dec = getValueFromItem(item, item.value, pwd || this.pwd);
  } catch (ex) {
    if (!item.backup) throw ex;

    dec = getValueFromItem(item, item.backup, pwd || this.pwd);
  }

  if (this.options.noCache !== true) {
    // cache result
    this.cache[key] = dec.value;
  }

  return dec.value;
}
