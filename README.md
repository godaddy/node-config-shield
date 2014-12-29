# Config Shield


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
  * options.alg (default: 'aes-256-ctr') - Algorithm to use for encryption.
  * cb (function(err)) - If callback is provided, will save asynchronously,
    otherwise will return synchronously.
* getProp (propName) - Return decrypted config value.
* setProp (propName, propValue) - Store config value.
* removeProp (propName) - Remove config value.
* removeAll () - Remove all config values.
* getKeys () - Return an array of available property keys.
* getInstance (instanceName) - Return a config instance.
* setInstance (instance) - Set a config instance.


## Future

Possible future enhancements:

* tts - Time to stale before auto-reloading config.
