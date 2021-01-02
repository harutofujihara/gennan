const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./dev/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    globalObject: "this",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // alias: {
    //   react: path.resolve("./node_modules/react"),
    // },
  },
  devServer: {
    contentBase: path.join(__dirname, "dev"),
    open: true,
    port: 3001,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "dev/index.html"),
    }),
  ],
};
