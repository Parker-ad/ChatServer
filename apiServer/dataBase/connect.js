// 连接数据库
const mongoose = require('mongoose');
// 数据库连接对象，它是一个promise对象 可用then catch执行成功或错误的代码
mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log('Database is connected...')})
    .catch(() => {console.log('Database not connected!')});