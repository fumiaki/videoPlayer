var path = require('path');

module.exports = [
  {
    entry: "./src/main/main.js",
    output: {
      path: path.resolve(__dirname, "build/main"),
      filename: "main.js",
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: path.resolve(__dirname, "node_modules"),
          query: {
              presets: ["env"]
          }
        }
      ]
    },
  },
  {
    entry: './src/renderer/app.js',
    output: {
      path: path.resolve(__dirname, 'build/renderer'),
      filename: 'app.js'
    },
    target: 'electron-renderer',
    module: {
      rules:[
        /*
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          loader: 'babel-loader',
          query: {
            presets: ['env'],
          }
        },*/
        {
          test: /\.node$/,
          loader: 'node-loader'
        }

      ]
    }
  }
]
