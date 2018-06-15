module.exports = {
    entry: [
      './src/index.js'
    ],
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          include: __dirname + '/src',
          exclude: '/node_modules/',
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      filename: 'bundle.js',
      path: __dirname + '/dist'
    }
  }