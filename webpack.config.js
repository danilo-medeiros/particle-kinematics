module.exports = {
    entry: [
      './src/index.js'
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: __dirname + '/src',
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      filename: 'bundle.js',
      path: __dirname + '/dist'
    }
  }