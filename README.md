# Webpack React Starter 

- webpack-dev-server on port 3000.
- webpack configuration with output.publicPath = "http://localhost:3000/assets/".
- bundle is served from memory at /assets/bundle.js
- when compiling files for production, use --output-public-path /assets/.
- run webpack-dev-server --hot --inline --port 3000 --content-base dist/ or npm start