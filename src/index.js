import React from 'react'
import ReactDom from 'react-dom'
import Root from './Root'

if(process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

ReactDom.render(<Root />, document.getElementById('root'))
