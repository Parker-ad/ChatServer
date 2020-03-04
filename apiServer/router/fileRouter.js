const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    // 指定文件路径
    // 设置上传后文件路径 uploads文件夹会自动创建
    destination: (req, file, cb) => {
        // 这个路由接口调用是在server文件 所以是当前文件下的pulic文件夹下的upload
        cb(null, './public/upload');
    },
    // 给上传文件重命名，获取添加后缀名
    filename: (req, file, cb) => {
        // 获取后缀名的方法
        // 将file对象里的原始名用split切分成数组
        // 再用获取数组内最后一个元素即为后缀名
        // 在保存时拿出来即可
        let fileFormat = (file.originalname).split(".");
        // 给图片加上时间戳格式防止重命名
        // 比如把abc.jpg图片且各位数组[abc,jpg],然后用数组长度-1获取后缀名
        // 指定文件名
        // 上传到的文件夹名-日期-后缀名
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

// 上传文件类型限制
function fileFilter (req, file, cb) {
    let {mimetype} = file;
    // 允许上传的数据类型
    let types = ['jpg', 'jpeg', 'png', 'gif'];
    let tmpType = mimetype.split('/')[1];
    if (types.indexOf(tmpType) == -1) {
        // 这里把获取到的后缀名作为条件在允许类型的数组里查找索引号
        // arr.indexOf()会返回括号内元素在数组里的索引号
        // 如果没有则返回-1 起到了判断是否为允许数据类型的作用
        cb(null, false);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize : 512000}, // 上传数据大小限制
    fileFilter: fileFilter

});

/**
 * @api {post} /file/upload 上传图片
 * @apiName upload
 * @apiGroup File
 *
 * @apiParam {formData} upload 图片数据
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

// 上传图片必须用post方法
// upload.single('upload') upload为要上传图片数据的key名
// {'upload':图片数据}
// 这个key名必须和前端统一 否则会上传失败
router.post('/upload', upload.single('upload'), (req, res, next) => {
    // 如果为undefined则是文件类型错误
    if (req.file == undefined) {
        res.send({err: -1, msg:'文件类型错误'});
    } else {
        // 拼接图片路径返回给前端,前端拼接域名即可
        let url = `http://127.0.0.1:3000//upload/${req.file.filename}`;
        res.send({err: 0, msg:'上传成功', img: url});
    }

});
// 由于multer没有处理文件过大错误的函数所以需要自己处理错误
// 采用中间件的形式处理文件过大的错误
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.send({err: -2, msg: '文件过大'});
    }
});
    
module.exports = router;
