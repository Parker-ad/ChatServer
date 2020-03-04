const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, min: 6, max: 15},
    age: {type: Number, default: 18},
    sex: {type: String, default: 0},
    avatar: {type: String, default: '/upload/1.jpg'}
});
// 将schema对象转化为数据模型
// 该数据对象和集合关联('集合名'， schema对象)
const User = mongoose.model('user', userSchema);

module.exports = User;