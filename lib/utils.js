'use strict';

module.exports = {
  normalizeKey: normalizeKey
};

function normalizeKey(key) {
  return key.replace(/^\s+/gm, '').replace(/\s+[\r\n]*$/gm, '').replace(/[\n\r]+/g, '');
}
