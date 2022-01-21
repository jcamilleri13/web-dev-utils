// Stop Sanity blowing up with ES6+ packages in the `@james-camilleri` namespace.
module.exports = function (config, options) {
  config.module.rules[0].exclude =
    /(node_modules|bower_components)\/(?!@james-camilleri)/

  return config
}
