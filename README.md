# Config Shield

[![Build Status](https://travis-ci.org/godaddy/node-config-shield.png)](https://travis-ci.org/godaddy/node-config-shield) [![NPM version](https://badge.fury.io/js/config-shield.png)](http://badge.fury.io/js/config-shield) [![Dependency Status](https://gemnasium.com/godaddy/node-config-shield.png)](https://gemnasium.com/godaddy/node-config-shield) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/godaddy/node-config-shield/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![NPM](https://nodei.co/npm/config-shield.png?downloads=true&stars=true)](https://www.npmjs.org/package/config-shield)


## About

The mission behind this project is to provide a "safe" process from which to store
properties sensitive in nature, in a manner that is both developer friendly as
well as optimized for production use.



## Making configuration changes

Install `config-shield` in your project:
```
  npm install config-shield --save
```
Startup the command-line interface from root of application:
```
  npm run config-shield
  : enter path of config (enter to use secure-config.json)>
  : enter path of private key> my.app.key
  set simple_property true
  set my-json-prop { "nested": { "values": [ 1, 2, 3 ] } }
  set null-prop null
  set evaluable-prop-as-string "null"
  set string-prop this will be stored as string if type cannot be determined
  set array-pop [ 1, 2, 3 ]
  set boolean-prop true
  set number-prop 5
  remove number-prop
  get my-json-prop
  : { "nested": { "values": [ 1, 2, 3 ] } }
  save
  : changes saved
  exit
```
Optionally you may also install `config-shield` globally:
```
  npm install config-shield -g
  config-shield
```

## Deploy your config

This step should be built into your CICD process, to clone the applicable
environment config and copy `secure-config.json` over. Ideally these
assets will be in a limited-access store to avoid unnecessary risk.

***Do not under any circumstance store your production private keys within
your project.***


## Loading config from your App
```
  var secureConfig = require('config-shield');
  // one-time load
  secureConfig.load({
    configPath: './secure-config.json', // not required if default
    privateKeyPath: '/etc/pki/tls/certs/my.app.key'
  });

  var myObj = secureConfig.getProp('my-json-prop');
```
Access your secure config from anywhere in your app:
```
  var secureConfig = require('config-shield');
  var myObj = secureConfig.getProp('my-json-prop');
```
Multiple configs? No problem:
```
  var secureConfig = require('config-shield');
  secureConfig.load({
    instance: 'my-other-config',
    configPath: './my-other-secure-config.json',
    privateKeyPath: '/etc/pki/tls/certs/my.app.key'
  });

  var myOtherSecureConfig = secureConfig.instance('my-other-config');
  var myObj = myOtherSecureConfig.getProp('my-prop');
```


## Developer Environment

Optionally you may include your development private key within your project to keep
things simple, but ***please do not do this*** for production environments as
you'll be negating the value of this module. Only a limited few should have access
to production private keys.



## API
```
  var secureConfig = require('config-shield');
```
* load (options[, cb]) - Load config.
  * options.instance (default: 'default') - Name of the config instance.
  * options.configPath (required) - Config to load, relative to the current working directory.
  * options.privateKeyPath (required) - Private key to load. Or could be any secret.
  * options.noCache (default: false) - Will disable caching of decrypted values if true.
  * options.alg (default: 'aes-256-ctr') - Algorithm to use for encryption.
  * cb (function(err, secureConfig)) - If callback is provided, will load asynchronously,
    otherwise will return synchronously.
* save ([configPath][, cb]) - Save config.
  * configPath (required) - Config to save, relative to the current working directory.
  * cb (function(err)) - If callback is provided, will save asynchronously,
    otherwise will return synchronously.
* convert ([options][, cb]) - Convert existing config to new private key.
  * options.privateKeyPath (required) - Private key file to load. Or could be any secret file.
  * options.backup (default: `false`) - Write old config values as `backup` to allow for a rotationary period where
    old key will continue to work.
  * options.alg (default: 'aes-256-ctr') - Algorithm to use for encryption.
  * options.normalizeKey (default: `false` or current normalizeKey) - Removes whitespace from key.
  * cb (function(err)) - If callback is provided, will save asynchronously,
    otherwise will return synchronously.
* dropBackup () - Removes all backup keys.
* getProp (propName) - Return decrypted config value.
* setProp (propName, propValue) - Store config value.
* removeProp (propName) - Remove config value.
* removeAll () - Remove all config values.
* getKeys () - Return an array of available property keys.
* getInstance (instanceName) - Return a config instance.
* setInstance (instance) - Set a config instance.



## Rotating keys

In the case you have keys that must be rotated, you can use the convert with `backup` option. The process would
require you to:

1. Load config with old private key.
2. Convert with new private key, setting `backup` to `true`.
3. Deploy your config change.
4. Rotate your private keys.
5. Load config with new private key.
6. Run `dropBackup`.
7. Deploy your final config change.

In CLI, would look something like:

```
  config-shield
  enter path of config> secure-config.json
  enter path of private key> old.key
  > convert
  enter path of private key> new.key
  backup old values to enable key rotations? (enter to disable, or `true`)> true
  > save
  > exit
```

Deploy your change, then update your config one last time:

```
  config-shield
  enter path of config> secure-config.json
  enter path of private key> new.key
  > dropBackup
  > save
  > exit
```

Deploy the final config. If you skip the step of dropping the backup, your config will
become vulnerable to attacks using the old private key, negating most of the value of
rotating keys.


## Future

Possible future enhancements:

* tts - Time to stale before auto-reloading config.


## License

[MIT](https://github.com/godaddy/node-config-shield/blob/master/LICENSE.txt)
