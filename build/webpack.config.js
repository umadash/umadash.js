const path = require('path')
const webpack = require('webpack')

// 参考: https://ics.media/entry/16329
module.exports = { 
  // エントリーポイントの設定
  entry: {
    app: "../src/ts/app.ts",
    common: "../src/ts/common.ts",
  },  
  output: {
    // 出力先のパス
    path: path.resolve('../public/js'),
    publicPath: "/",

    // 出力するファイル名
    filename: "[name].bundle.js",
  },  
  module: {
    rules: [
      // typescript
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader'
      },
      // ソースマップファイルの処理
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [
      '.ts'
    ]
  },
  plugins: [
    // 指定した変数を他のモジュール内で使えるようにする
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }) 
  ],
  // ソースマップを有効
  devtool: 'source-map',
  // watchモードを有効
  watch: true
};