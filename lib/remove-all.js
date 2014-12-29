module.exports = removeAll;

function removeAll () {
  // reset
  this.config.properties = {};
  this.cache = {};
}
