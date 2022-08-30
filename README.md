- added virtual module plugin to write derby views
  - success!!
- issues w racer-highway
  1. adding highway for connection adds a slew of polyfills
  1. highway/ws library needing tls polyfill but no suggestion
  1. highway/ws failed resolution of utf-8-validate and bufferutil
  1. conneciton modules also coupled to bundler. browserchannel and highway add themselves to bundle and add one time transform for `{{clientOptions}}` https://github.com/derbyparty/racer-highway/blob/2ad904aa798ff3bf8bd7e159592c0b72cca582e9/lib/server/bundle.js#L42
  1. derby includes racer before app does, leading to two copies of racer in bundle
- some issues maybe due to `yarn link` causing duplicates?
- how to include channel plugin into derby app; currently dependent on browserify hack injecting package (and config thru module processing) into client bundle
- derby relies on `data-derby-app` sibling to get data (instead of using id)
- derby message error: ShareDBError: Invalid or unknown message {"derby":"app","name":"test-mule","hash":"{{DERBY_SCRIPT_HASH}}"}
- Derby APP_NAME needs to be shared between DerbyViewsPlugin and app instance
- something being held open with views plugin -- need to shutdown
  - `./app` already calling `derby.createApp()`
  - HACK: temprarily chenge NODE_ENV to `production` in views plugin

- ShareDBError: Invalid or unknown message
  - chennel created outside of ApporServer?
  - not going through `AppFroServer._handleMessage()` method
  - `_handleMessage` registered in `bundle` method via `_autoRefresh` (WTF)
- `DERBY_SCRIPT_HASH` -- used for reload when browserfy processed bundle
  - needed if webpack handles reload?
  - can't produce hash and include w webpack (hash not available unitl post-build)




TODO
====
- [ ] browserchannel package.json `browser` update
- [ ] highway package.json `browser` update
- [ ] replace string replacemant for browserchannel client options
- [ ] replace string replacemant for highway client options
- [ ] derby API update for plugins (channel plugin) -- pass via createApp `options.plugins`?
- [x] resolve attachment error (was using `{server: true}` on serialization)
- [x] `saddle` update package `main`
- [ ] `derby` debrowserified; 
- [ ] fix `isProduction`: allow using something other than `NODE_ENV === 'production'` (prevent derby watching files and preventing webpack plugin process exiting)
- [x] generate manifest for index.html render
- [ ] hot-reload catching previous value, not current
- [ ] initial files never updated in hot reload - i.e. changes never reflected on refresh
- [ ] failure to fetch runtime.[hash].hot-update.json



 ## saddle
 (node:56021) [DEP0128] DeprecationWarning: Invalid 'main' field in '/Users/cbeck/dev/derby2/derby/node_modules/saddle/package.json' of './lib/index.js'. Please either fix that or report it to the module author

 ## mold-source-map
 *dont care - browserify dependency*
 (node:56021) [DEP0128] DeprecationWarning: Invalid 'main' field in '/Users/cbeck/dev/derby2/test-mule/node_modules/mold-source-map/package.json' of 'mold-source-map.js'. Please either fix that or report it to the module author

