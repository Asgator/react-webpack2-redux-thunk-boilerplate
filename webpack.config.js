const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const buildPath = path.join(__dirname, './build');
const staticPath = path.join(__dirname, './static');
const srcPath = path.join(__dirname, './src');

// Common plugins
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor-[hash].js',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(staticPath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
      context: srcPath,
    },
  }),
  new ExtractTextPlugin('style-[hash].css')
];

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader', exclude: /node_modules/,
    options: {
        configFile: '.eslintrc',
        failOnError: isProduction,
        fix: true
    }
  },
  {
    test: /\.less$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]modules!postcss-loader!less-loader'
    }),
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    loader: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
  },
];

if (isProduction) {
  // Production plugins
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })
  );
} else {
  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = {
  devtool: isProduction ? 'eval' : 'source-map',
  context: srcPath,
  entry: {
    js: './index.js',
    vendor: [
      'babel-polyfill',
      'es6-promise',
      'isomorphic-fetch',
      'react-dom',
      'react-redux',
      'react-router',
      'react',
      'redux-thunk',
      'redux',
    ],
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app-[hash].js',
  },
  module: {
    rules,
  },
  resolve: {
    modules: ['src', 'node_modules', 'src/components'],
    extensions: ['.js', '.jsx', '.es6', '.less', '.yml', '.json']
  },
  plugins,
  devServer: {
    contentBase: isProduction ? './build' : './source',
    historyApiFallback: true,
    port: 3000,
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
