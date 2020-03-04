const express = require('express')

const db = require('./dataBase/connect')

const userRouter = require('./router/userRouter');
const fileRouter = require('./router/fileRouter');

const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// // 设置跨域和相应数据格式
app.all('*',(req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  // if (req.method == 'OPTIONS') res.send(200)
  // /*让options请求快速返回*/ else next()
  next()
})

app.use(express.static('./public'))

app.use('/user', userRouter);
app.use('/file', fileRouter);

app.use(function(req, res, next) {
  res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(3000, () => {
  console.log('server running...')
})