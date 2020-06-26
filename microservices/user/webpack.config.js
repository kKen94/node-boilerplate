const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const resolveTsconfigPathsToAlias = require('./resolve-paths');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  externals: {
    'pg-native': true,
    'cors': true,
    'kcors': true,
    'spdx-exceptions': true,
    'spdx-license-ids': true,
    'spdx-license-ids/deprecated': true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: resolveTsconfigPathsToAlias(),
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ],
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg-native/, /pg-query-stream/, /react-native-sqlite-storage/, /redis/, /sqlite3/, /sql.js/, /typeorm-aurora-data-api-driver/, /@sap\/hdbext/, /body-parser/, /express/, /koa-multer/]
    })
  ]
};
