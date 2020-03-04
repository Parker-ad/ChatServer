const express = require('express');
const router = express.Router();
const User = require('../dataBase/model/userModel');
// 引入发送邮件接口
const Mail = require('../util/mail');
const JWT = require('../util/jwt')
/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
 * @apiGroup user
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} email 邮箱
 * @apiParam {String} password 用户密码
 * @apiParam {String} code 邮箱验证码
 * @apiParam {Number} age 年龄
 * @apiParam {String} sex 性别 0男 1女
 *
 * @apiSuccess {String} firstname Firstname of the usernameer.
 * @apiSuccess {String} lastname  Lastname of the usernameer.
 */

//创建一个对象 通过内存保存验证码
let codes = {}
// 创建一个对象 通过内存保存时间戳
let stamp = {}
// 用户注册
router.post('/reg', (req, res) =>{
// 获取数据
    let {username, email, password, code, age, sex} = req.body;
    
    if (username && password && code && email) {
        // 判断验证码是否正确 用户输入的验证码是否等于codes里用户名相匹配的验证码
        // 用户传过来的值为可能是字符串类型的 所以得用!= 而不是!==
        if(codes[email] != code) {
            return res.send({err: -4, msg: '验证码错误'});
        }
       // 验证用户名是否已经被注册
        User.findOne({email})
            .then(data => {
                if (!data) {
                    // 用户名不存在可以注册
                    // ruturn出去让下一个then执行
                    User.insertMany({username, password, email, age, sex})
                        .then(() => {res.send({err: 0, msg: '注册成功'})})
                        .catch(() => {res.send({err:-2, msg: '注册失败'})});
                } else {
                    res.send({err: -3, msg: '邮箱已存在'});
                }
            });
    } else {
        return res.send({err: -1, msg: '参数错误'});
    }
});


/**
 * @api {post} /user/login 用户登录
 * @apiName 用户登录
 * @apiGroup user
 *
 * @apiParam {String} email 邮箱地址
 * @apiParam {String} password 用户密码
 *
 * @apiSuccess {String} firstname Firstname of the usernameer.
 * @apiSuccess {String} lastname  Lastname of the usernameer.
 */
// 用户登录
router.post('/login', (req, res) => {
    let {email, password} = req.body;
    if (!email || !password) {return res.send({err: -1, msg: '参数错误'})}
    User.findOne({email, password})
        .then(data => {
            // 这里用findOne方法查找 如果不为空则是找到了这个账户 登陆成功
            // 如果为空则是用户名或密码不正确
            if (data != null) {
                let {username, avatar} = data
                let token = JWT.craetToken({login: true, email})
                res.send({err: 0, msg : '登录成功', token, username, avatar, email});
            } else {
                res.send({err: -2, msg : '用户名或密码不正确'});
            }
        })
        .catch(err => {
            return res.send({err: -1, msg : '内部错误'});
        });
        
});

/**
 * @api {post} /user/mailcode 发送邮箱验证码
 * @apiName 发送邮箱验证码
 * @apiGroup user
 *
 * @apiParam {String} email 邮箱地址
 *
 * @apiSuccess {String} firstname Firstname of the usernameer.
 * @apiSuccess {String} lastname  Lastname of the usernameer.
 */

// 邮箱验证码模块
router.post('/mailcode', (req, res) => {
    let {email} = req.body;
    // 产生随机数作为验证码
    let code = parseInt(Math.random()*10000);
    // 获取现在最新的时间
    let timeNow = Date.now();
    // 设一个定时器开关
    let timer = true;
    // 如果这个邮箱没有时间戳，则给一个时间戳
    if (stamp[email] == undefined) {
        // 给这个邮箱一个时间戳
        stamp[email] = Date.now();
    } else {
        // 有时间戳则计算现在距离时间戳有没有超过30秒
        timer = timeNow - stamp[email] > 30000 ? true : false;
        // 当超过了30秒后重新给一个时间戳 如果没超过则为原来的值
        stamp[email] = timer ? Date.now() : stamp[email];
    }
    if (timer) {
        Mail.send(email, code)
        // 判断发送成功或失败
            .then(() => {
            // 在这个对象里用email做属性名，code做属性名的属性值
            // 并保存到内存中
            codes[email] = code;
            res.send({err: 0, msg:'验证码发送成功'});
            })
            .catch(err => {
                if(timer) {
                    res.send({err: -1, msg:'验证码发送失败'});
                } else {
                    res.send({err: -5, msg:'请五分钟后再试'});
                }
            });
    } else {
        res.send({err: -5, msg:'请在五分钟之后再试'});
    }
});

router.put('/info', (req, res, next) => {
    let { token } = req.body
    JWT.checkToekn(token)
      .then(data => {
        next()
      })
      .catch(err => {
        res.send({err: -999, msg: '无效的token'})
      })
})
/**
 * @api {put} /user/info 修改用户信息
 * @apiName 修改用户信息
 * @apiGroup user
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} email 邮箱
 * @apiParam {String} password 用户密码
 * @apiParam {Number} age 年龄
 * @apiParam {String} sex 性别 0男 1女
 * @apiParam {String} avatar 头像 url地址
 *
 * @apiSuccess {String} firstname Firstname of the usernameer.
 * @apiSuccess {String} lastname  Lastname of the usernameer.
 */
router.put('/info', (req, res) => {
    let {username, email, password, age, sex, avatar} = req.body
    User.updateOne({email}, {username, password, age, sex, avatar})
        .then(data => {
            res.send({err: 0, msg: '更新成功'})
        })
        .catch(err => {
            res.send({err: -1, msg: '更新失败'})
        })
})

/**
 * @api {get} /user/info/:email 查询用户信息
 * @apiName 查询用户信息
 * @apiGroup user
 *
 * @apiParam {String} email 邮箱
 *
 * @apiSuccess {String} firstname Firstname of the usernameer.
 * @apiSuccess {String} lastname  Lastname of the usernameer.
 */

router.get('/info/:email', (req, res) => {
    const email =  req.params.email
    User.findOne({email})
        .then(data => {
            if (!data) {
                res.send({err: -1, msg: '查询失败'})
            } else {
                res.send({err: 0, info: data});
            }
        });
})
module.exports = router;
