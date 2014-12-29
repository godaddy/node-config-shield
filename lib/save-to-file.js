var SecureConfig = require('./secure-config');
var fs = require('fs');

module.exports = saveToFile;

function saveToFile (configFile, cb) {
  // prettify it so it's a bit easier to read
  var json = JSON.stringify(this.config, null, 2);

  if (typeof cb === 'function') {
    return fs.writeFile(configFile, json, { encoding: 'utf8' }, cb);
  } else {
    return fs.writeFileSync(configFile, json, { encoding: 'utf8' });
  }
}
