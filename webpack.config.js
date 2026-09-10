const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');



module.exports = (env, argv) => {

  const isDevelopment = argv.mode !== 'production';

    return {
        entry: {
            bundle: path.resolve(__dirname, 'src', 'main.tsx'),
        },

        output: {
            cssFilename: 'assets/styles/[name].[contenthash].css',
            path: path.resolve(__dirname, 'build'),
            filename: 'assets/js/[name].[contenthash].js',
            chunkFilename: 'assets/js/[name].[contenthash].chunk.js',
            publicPath: '/',
            clean: true,
        },

        devtool: isDevelopment ? 'source-map' : false,

        devServer: {
            static: path.resolve(__dirname, 'public'),
            hot: true,
            historyApiFallback: true, // SPA routing
            open: true,
            compress: true,
            port: 3000,
        },

        experiments: {
            css: true
        },

        module: {
            parser: {
                css: {
                    exportType: "link",
                    fontPreload: true
                },
            },
            rules: [
                {
                    test: /\.([jt]sx?)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                isDevelopment && require.resolve('react-refresh/babel')
                            ].filter(Boolean)
                        }
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name].[contenthash][ext]'
                    }
                },

                {    // PatternFly
                    test: /\/dist\/static\/[a-zA-Z]+\.svg$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/icons/[name].[contenthash][ext]'
                    }
                },
                {
                    test: /\.(ttf|woff2)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name].[contenthash][ext]'
                    }
                },

                /**
                 * Customize .svg
                 * 
                 * Note: must be after any other rules that may match.
                 */

                {    // src/images/icons
                    test: /\/(icons|icons\/[a-zA-Z]+)\/[a-zA-Z]+\.svg$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/icons/[name].[contenthash][ext]'
                    }
                },
            ]
        },

        optimization: {
            minimize: isDevelopment ? false : {
                css: {
                    comments: false
                }
            },
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    patternfly: {
                        test: /[\\/]node_modules[\\/]@patternfly[\\/]/,
                        chunks: "all",
                        priority: 30,
                        enforce: true,

                        name(module) {

                            // extract @patternfly/<package-name>
                            const match = module.context?.match(
                                /[\\/]node_modules[\\/]@patternfly[\\/](.*?)([\\/]|$)/
                            );

                            if (!match) return "patternfly-misc";

                            const packageName = match[1]; // e.g. react-core, react-icons

                            return `patternfly-${packageName.replace(/[\\/]/g, "-")}`;
                        },
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "all",
                        priority: 10,
                        name(module) {

                            // extract node_modules/<module-name>
                            const match = module.context?.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            );

                            if (!match) return "vendor-misc";

                            const packageName = match[1]; // e.g. react-core, react-icons

                            return `vendor-${packageName.replace(/[\\/]/g, "-")}`;
                        },
                    },
                },
            }
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html')
            }),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public",
                        to: ".",
                        globOptions: {
                            ignore: ["**/index.html"]
                        }
                    }
                ]
            })
        ].filter(Boolean),

        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
    };

};
