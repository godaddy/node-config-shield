'use strict';

module.exports = removeProp;

function removeProp(name) {
  // remove prop if exists
  delete this.config.properties[name];
  // remove from cache as well
  delete this.cache[name];
}
