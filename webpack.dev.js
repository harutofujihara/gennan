const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./demo/src/index.tsx",
  output: {
    path: path.resolve(__dirname, "demo/dist"),
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         modules: true,
      //       },
      //     },
      //   ],
      // },
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
      template: path.resolve(__dirname, "demo/src/index.html"),
    }),
  ],
};
