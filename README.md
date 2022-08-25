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


 TODO
 ====
 - [ ] browserchannel package.json `browser` update
 - [ ] highway package.json `browser` update
 - [ ] replace string replacemant for browserchannel client options
 - [ ] replace string replacemant for highway client options
 - [ ] derby API update for plugins (channel plugin)
 - [ ] resolve attachment error
 - [ ] `saddle` update package `main`