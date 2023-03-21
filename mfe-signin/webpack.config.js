const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const pckg = require("./package.json");


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
    port : 8081,
  },

  entry : path.resolve(__dirname, "src", "main.js"),

  resolve : {
    extensions : [".js", ".jsx"]
  },

  output : {
    path : path.resolve(__dirname, 'dist'),
    publicPath : "http://localhost:8081/",
    filename : "chunks/[name].js",
    chunkFilename : "chunks/[name].js"
  },

  plugins : [
    new ModuleFederationPlugin({
      name : "mfeSignin",
      library : {
        type : "var",
        name : "mfeSignin"
      },
      filename : "remoteEntry.js",
      exposes : {
        "./Root" : path.resolve(__dirname, "src", "bootstrap.jsx")
      },
      shared : {
        // Make sure to load only one version of `react` across all the MFEs
        // See https://github.com/webpack/webpack/issues/11033#issuecomment-713303076
        react : {
          // Avoid "Unsatisfied version x.x.x of shared singleton module" warning in browser console
          // See https://stackoverflow.com/a/66298310
          requiredVersion : pckg.dependencies.react,
          singleton : true
        },
        "react-dom" : {
          // Avoid "Unsatisfied version x.x.x of shared singleton module" warning in browser console
          // See https://stackoverflow.com/a/66298310
          requiredVersion : pckg.dependencies["react-dom"],
          singleton : true
        }
      }
    })
  ],

  module : {
    rules : [{
      test : /\.(js|jsx)$/,
      exclude : [
        // Some module should not be transpiled by Babel
        // See https://github.com/zloirock/core-js/issues/743#issuecomment-572074215
        path.resolve(__dirname, "node_modules", "core-js"),
        path.resolve(__dirname, "node_modules", "webpack", "buildin"),
        // Too big and already supports browsers we target
        path.resolve(__dirname, "node_modules", "react"),
        path.resolve(__dirname, "node_modules", "react-dom"),
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
          }],
          // Handles jsx
          ["@babel/preset-react", {
            useBuiltIns : false,
            development : true
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
