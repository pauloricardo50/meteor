const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(
      `${__dirname}../../../core/assets/public/files/frontPlugin`,
    ),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    symlinks: false,
  },
  mode: 'development',
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600,
  },
  plugins: [
    // These 2 ignore conditional requires in api/methods/methods
    new webpack.IgnorePlugin(/^.+getClientUrl/),
    new webpack.IgnorePlugin(/^.+getClientTrackingId/),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    // Replace any meteor module with our meteor mock
    new webpack.NormalModuleReplacementPlugin(/^meteor.*$/, resource => {
      resource.request = './src/meteor';
      resource.context = `${
        resource.context.split('/frontPlugin')[0]
      }/frontPlugin`;
    }),
    new webpack.IgnorePlugin(/file-saver/),
    new webpack.IgnorePlugin(/i18n-iso-countries/),
  ],
  stats: {
    modulesSort: '!size',
  },
};
