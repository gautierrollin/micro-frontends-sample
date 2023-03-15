const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");


module.exports = {

  mode : "development",

  // Each module is executed with eval() and //@ sourceURL.
  // This is pretty fast.
  // The main disadvantage is that it doesn't display line numbers correctly.
  // `eval` causes a lot of warnings in the browser console
  devtool : "eval-cheap-source-map",

  devServer : {
    hot : false,
    // Allow server access to anyone
    allowedHosts : "all",
    // Redirect all origin requests to the root file
    historyApiFallback : true,
    // Externally reachable
    host : "0.0.0.0",
    // Custom port
    port : 8080,
  },

  entry : path.resolve(__dirname, "src", "main.js"),

  output : {
    path : path.resolve(__dirname, 'dist'),
    publicPath : "/",
    filename : "chunks/[name].js",
    chunkFilename : "chunks/[name].js"
  },

  plugins : [
    new HtmlWebpackPlugin({
      template : path.resolve(__dirname, "templates", "index.ejs"),
      remoteEntries : Object.values({
        "mfe-header" : "http://localhost:8082/remoteEntry.js",
        "mfe-settings" : "http://localhost:8083/remoteEntry.js",
        "mfe-signin" : "http://localhost:8081/remoteEntry.js"
      })
    }),
    new ModuleFederationPlugin({
      name : "mfeRoot",
      library : {
        type : "var",
        name : "mfeRoot"
      },
      filename : "remoteEntry.js",
      remotes : {
        mfeHeader : "mfeHeader",
        mfeSettings : "mfeSettings",
        mfeSignin : "mfeSignin"
      }
    })
  ],

  module : {
    rules : [{
      test : /\.(js)$/,
      exclude : [
        // Some module should not be transpiled by Babel
        // See https://github.com/zloirock/core-js/issues/743#issuecomment-572074215
        path.resolve(__dirname, "node_modules", "core-js"),
        path.resolve(__dirname, "node_modules", "webpack", "buildin")
      ],
      loader : "babel-loader",
      options : {
        babelrc : false,
        // Fixes "TypeError: __webpack_require__(...) is not a function"
        // https://github.com/webpack/webpack/issues/9379#issuecomment-509628205
        // https://babeljs.io/docs/en/options#sourcetype
        sourceType : "unambiguous",
        presets : [
          // Allows to use the latest JavaScript without needing to micromanage which syntax transforms
          // and browser polyfills are needed by the target environment(s)
          ["@babel/preset-env", {
            // Webpack supports ES Modules out of the box and therefore doesn’t require import/export
            // to be transpiled resulting in smaller builds, and better tree shaking
            // See https://webpack.js.org/guides/tree-shaking/#conclusion
            modules : false,
            // Adds specific imports for polyfills when they are used in each file.
            // Take advantage of the fact that a bundler will load the same polyfill only once.
            useBuiltIns : "usage",
            corejs : {
              version : "3",
              // We are not using proposals (this will reduce bundle size)
              proposals : false
            }
          }]
        ],
        // Plugins
        plugins : [
          // Require the Babel runtime as a separate module to avoid the duplication
          // https://webpack.js.org/loaders/babel-loader/#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
          "@babel/plugin-transform-runtime"
        ]
      }
    }]
  }

};
