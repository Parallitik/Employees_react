const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

const isDev = process.env.NODE_ENV === "development";
const withReport = process.env.npm_config_withReport;

module.exports = {
    devServer: {
        client: {
            logging: "info",
        },
        compress: true,
        historyApiFallback: true,
        port: 3000,
    },
    devtool:
        process.env.NODE_ENV === "production"
            ? "hidden-source-map"
            : "eval-source-map",
    entry: path.resolve(__dirname, "./src/index.tsx"),
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    output: {
        clean: true,
        environment: {
            arrowFunction: false,
        },
        filename: "[name].bundle.[chunkhash].js",
        path: path.resolve(__dirname, "./build"),
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.jsx?$/,
                use: ["babel-loader"],
            },
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                exclude: /\.module\.s?css$/i,
                test: /\.s?css$/i,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]___[hash:base64:5]",
                                mode: "icss",
                            },
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.module\.s?css$/,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[hash:base64:5]",
                                mode: "local",
                            },
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                generator: {
                    filename: "static/[hash][ext]",
                },
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            //  для статической страницы в bundle
            //   {
            //     loader: "html-loader",
            //     test: /\.html$/i,
            //   },
        ],
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()],
    },
    performance: {
        hints: false,
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./public/index.html"),
        }),
        ...(isDev
            ? [new MiniCssExtractPlugin()]
            : [
                new MiniCssExtractPlugin({
                    chunkFilename: "[name].[contenthash].css",
                    filename: "[name].[contenthash].css",
                }),
            ]),
        ...(withReport ? new BundleAnalyzerPlugin() : ""),
        new Dotenv()
    ],
    resolve: {
        alias: {
            components: path.resolve(__dirname, "src/components/"),
            src: path.resolve(__dirname, "src"),
            store: path.resolve(__dirname, "src/store"),
            svg: path.resolve(__dirname, "src/assets/svg"),
        },
        extensions: [".jsx", ".js", ".ts", ".tsx"],
    },
};