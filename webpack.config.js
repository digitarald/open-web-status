module.exports = {
  cache: true,
  entry: './index',
  output: {
    filename: 'browser-bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader?harmony'},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'}
    ]
  }
};
