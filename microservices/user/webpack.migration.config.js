const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: glob.sync(path.resolve('src/migrations/*.ts')).reduce((entries, filename) => {
        const migrationName = path.basename(filename, '.ts');
        return Object.assign({}, entries, {
            [migrationName]: filename,
        });
    }, {}),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        // assuming all your migration files are written in TypeScript
        extensions: ['.ts']
    },
    output: {
        // change `path` to where you want to put transpiled migration files.
        path: __dirname + '/dist/migrations',
        // this is important - we want UMD (Universal Module Definition) for migration files.
        libraryTarget: 'umd',
        filename: '[name].js',
    },
    optimization: {
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
            exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg-native/, /pg-query-stream/, /react-native-sqlite-storage/, /redis/, /sqlite3/, /sql.js/, /typeorm-aurora-data-api-driver/]
        })
    ]
};
