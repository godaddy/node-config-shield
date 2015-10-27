'use strict';

module.exports = getKeys;

function getKeys() {
  return Object.keys(this.config.properties);
}
