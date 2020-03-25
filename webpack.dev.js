//webpack 모드 개발로 설정
//https://webpack.js.org/guides/production/#root 참고

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // 소스맵 설정
  devServer: {
    contentBase: '/dist'
  }
})