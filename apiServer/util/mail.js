"use strict";
const nodemailer = require("nodemailer");

//   创建发送邮件的对象
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",  // 发送方邮箱 qq通过lib/well-known/service.json里查找邮箱信息
    port: 465, // 端口号
    secure: true, // true for 465, false for other ports
    auth: {
        // 发送方邮箱地址
      user: '2301633229@qq.com', // generated ethereal user
      // smtp 验证码
      pass: 'xjwrxwotdnsrecfa' // generated ethereal password
    }
  });

  
  

function send(mail, code) {
    let mailobj = {
        from: '"ParkerDoss" <2301633229@qq.com>', // sender address
        to: mail, // list of receivers
        subject: "注册验证码", // Subject line
        // text的参必须为字符串类型 所以要转换成字符串
        // text: code, // plain text body
        // html就不用
        html: "<h1>您的邮箱验证码为:</h1><h2>" + code + "</h2>"
    }

    // 包装成promise对象 因为可能会有发送失败的情况
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailobj, err => {
            if(err) {
               reject();
            } else {
                resolve();
            }
        });
    })
    
}
// 一般会把方法以对象的方式导出
module.exports = {send}