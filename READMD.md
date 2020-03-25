## React 개발환경을 구축하며 배우는 webpack4 기초
------
#### [모듈 번들러란?]
여러개의 나누어져있는 파일들을 하나의 파일로 만들어주는 라이브러리이다.     
모듈 번들러 라이브러리는 webpack, parcel등이 있다.     

여러개의 자바스크립트 파일을 하나의 파일로 묶어서 한 번에 요청을 통해 가지고 올 수 있게 하고,     
최신 자바스크립트 문법을 브라우저에서 사용할 수 있게 해준다.     
또한, 코드들을 압축하고 최적화 할 수 있기 때문에 로딩 속도를 높일 수 있다.     
수많은 파일이 하나의 파일로 묶인다면 초기 로딩 속도가 느려질 수 있지만 이를 해결하기 위해 청크, 캐시, 코드 스플릿 개념들을     
도입하면서 문제를 해결하고 있다.     

#### [프로젝트 설정]
1. 디렉터리를 만드신 후 아래와 같은 명령어를 통해 package.json파일 설치     
```
 npm init -y
```
2. 사용할 라이브러리들을 모두 설치     
```
npm add -D @babel/core @babel/preset-env @babel/preset-react babel-loader clean-webpack-plugin css-loader html-loader html-webpack-plugin mini-css-extract-plugin node-sass react react-dom sass-loader style-loader webpack webpack-cli webpack-dev-server
```
3. 자바스크립트 파일 빌드하기
src 디렉터리를 만든 후 index.js파일 작성
```js
  console.log('webpack hello!')
```

4. 최상위 디렉터리에 webpack.config.js 파일 작성
```js
  const path = require('path')

  module.exports = {
    mode: 'production', // webpack 빌드 옵션 1. development = 빠르게 빌드, 2. production = 최적화 빌드, 3. none 
    entry: './src/index.js', // webpack이 빌드할 파일 경로
    output: { // 빌드 후 명시되어있는 정보를 통해 빌드파일 생성
      filename: '[name].bundle.js', // 파일명
      path: path.resolve(__dirname, 'dist') // 저장될 디렉터리
    }
  }
```

5. package.json에 build명령어 입력 (명령어 npm run build)
```json
  "scripts": {
    "build": "webpack"
  },
```

6. webpack HTML파일 빌드
webpack은 자바스크립트 뿐만 아니라 다른 파일들도 모듈로 관리할 수 있다     
자바스크립드가 아닌 파일들을 관리하기 위해서 'loader'라는 기능이 있다     

loader 사용방법
```js
module: {
  rules: {
    test: '가지고 올 파일 정규식',
    use: [
      {
        loader: '사용할 로더 이름',
        options: {사용할 로더 옵션}
      }
    ]
  }
}
```

7. public 디렉터리를 만든 후 index.html 작성
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack4-react</title>
</head>
<body>
  <noscript>스크립트가 작동되지 않았습니다</noscript>
  <div id="root"></div>
</body>
</html>
```

8. webpack.config.js     
html-webpack-plugin 설치 (npm install --save-dev html-webpack-plugin)
html파일을 읽어서 빌드 할 수 있게한다.     
options으로는 minimize라는 코드 최적화 옵션을 사용하고 있다.     
(index.html내용이 minimize 옵션을 삭제하면 줄바꿈된 형태로 보여지고, 적용하면 한줄로 보여짐)
```js
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      templage: './public/index.html', // index.html파일을 읽는다
      filename: 'index.html' // output으로 출력한 파일 index.html
    })
  ]
}
```

9. webpack으로  React 빌드     
src/index.js 내용 작성
```js
import React from 'react'
import ReactDom from 'react-dom'
import Root from './Root'

ReactDom.render(<Root />, document.getElementById('root'))
```

src/Root.js 내용 작성
```js
import React from 'react'

const Root = () => {
  return (
    <div className="component">React Webpack</div>
  )
}

export default Root
```

최상위 디텍토리에서 .babelrc 파일 작성
```
바벨(babel)은 ES6에서 ES5로 자바스크립트를 변환해주는 역활을 한다.     
아래 내용은 바벨이 ES6와 리엑트를 ES5로 변환할 수 있게 해주는 내용
```

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

webpack.config.js 파일에 entry와 rules에 babel-loader 추가
```js

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: './node_modules',
        use: ['babel-loader']
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      templage: './public/index.html',
      filename: 'index.html'
    })
  ]
}
```

10. webpack css 사용하기
src/index.css 파일 작성
```css
.component {
  padding: 30px;
  color: tomato;
  font-size: 18px;
  background-color: lightsteelblue;
}
```
src/root.js에 index.css import 적용
```js
import React from 'react'
import 'index.css'

const Root = () => {
  return (
    <div className="component">React Webpack</div>
  )
}

export default Root
```

css-loader를 적용해서 css를 읽을 수 있도록하기 (npm install --save-dev css-loader)
```js

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: 'babel-loader'
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: 'css-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ]
}
```
build가 완료된 index.html 파일을 브라우저에서 열어보면 css가 적용되어있지 않습니다.     
왜냐하면 webpack에서 css 파일을 읽은 후 어딘가에 저장을 해야합니다.     
이럴때, css를 index.html에 합치는 방법도 있지만 파일을 추출해 보도록 하겠습니다      
webpack.config.js에 css를 추출해서 파일로 저장하는 플러그인을 작성
```js

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: 'babel-loader'
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        //sass-loader로 scss 파일을 읽고 css로 변환한 후 css-loader로 css 읽습니다. 그 후 MiniCssExtractPlugin으로 읽은 CSS를 파일로 추출
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
}
```

11. webpack 개발서버 적용하기
소스를 수정할 때 마다 build를 해야하는 불편함 점이 있다.
수정할 때마다 알아서 webpack이 build해주는 webpack-dev-server가 있다

먼저 webpack.config.js에 devServer 추가
```js

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    inline: true,
    hot: true,
    host: 'localhost',
    port: 8000
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: 'babel-loader'
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
}
```

package.json 파일 작성 
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "webpack-dev-server --open"
  }
```

npm run start 명령어를 실행하고 http://localhost:8080으로 접속하면 build된 모습을 볼 수 있다.
파일을 수정하고 저장하면 자동으로 build 

12. build 디텍터리를 깨끗하게
build 디텍터리를 clean-webpack-plugin을 통해서 build될때마다 불필요한 파일을 삭제할 수 있다.
```js

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve('./build'),
    index: 'index.html',
    port: 8000
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: 'babel-loader'
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CleanWebpackPlugin()
  ]
}
```