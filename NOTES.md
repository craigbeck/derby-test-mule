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
  - not going through `AppForServer._handleMessage()` method
  - RESOLVED `_handleMessage` registered in `bundle` method via `_autoRefresh` (WTF)
- `DERBY_SCRIPT_HASH` -- used for reload when browserfy processed bundle
  - needed if webpack handles reload?
  - can't produce hash and include w webpack (hash not available unitl post-build)

TODO
====
## racer-browserchannel
- [ ] browserchannel package.json `browser` update
- [ ] replace string replacemant for browserchannel client options
## racer-highway
- [ ] highway package.json `browser` update
- [ ] replace string replacemant for highway client options
## saddle
- [x] `saddle` update package `main`
## derby
- [x] generate manifest for index.html render
- [x] view updates propogated to client
- [ ] production build uses written manifest and existing bundles
- [ ] `derby` debrowserified; 
- [ ] derby API update for plugins (channel plugin) -- pass via createApp `options.plugins`?
- [ ] fix `isProduction`: allow using something other than `NODE_ENV === 'production'` (prevent derby watching files and preventing webpack plugin process exiting)
- [ ] `PageFroServer` writing script tags dependent on webpack-dev-middleware provided thru `res.locals` - abstract?
- [ ] `derby-loader` to watch `html` files and recompile virtual views module

- [ ] `Tail` is writed in correct place? seems to be inside `script` tag for app state



REQUEST LIFECYCLE
- [x] initial request [s0]
- [x] accept hot-reload module [s1]
- [x] accept hot-reload module [s2]
- [x] reload renders [s2] -- renders [s0], new scripts not written to page (stop writing hot-update files to scripts tags)
- [x] hot reload app
- [ ] hot reload component
TEST MULE APP
- [x] figure out app rerender w state serialization (when index.js changes)
- [x] server side require of changed modules
- [ ] add a component
- [ ] split route to new file (minimise index.js)

