# micro-frontends-sample

> Sample of micro frontends architecture with Webpack Module Federation and single-spa

# First things first

This repository aims to quickly demonstrate how micro-frontends architecture can be implemented with [Webpack Module Federation plugin](https://webpack.js.org/concepts/module-federation/) and [Single SPA](https://single-spa.js.org/).

Each sub-folder of this repository must be a dedicated repository in order to keep things separate and avoid anti-patterns as much as possible.

# Start application

```sh
git clone git@github.com:gautierrollin/micro-frontends-sample.git

cd ./mfe-root/
nvm use
npm install
# Will start a dev server on port 8080
npm start

cd ../mfe-signin
nvm use
npm install
# Will start a dev server on port 8081
npm start

cd ../mfe-header
nvm use
npm install
# Will start a dev server on port 8082
npm start

cd ../mfe-settings
nvm use
npm install
# Will start a dev server on port 8083
npm start
```

Go to http://localhost:8080