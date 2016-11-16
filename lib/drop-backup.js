'use strict';

module.exports = dropBackup;

function dropBackup() {
  var props = this.config.properties;
  Object.keys(props).forEach(function (key) {
    var item = props[key];
    if (item && item.backup) {
      delete item.backup;
    }
  });
}
