const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// 处理 http request 请求
app.use(bodyParser.urlencoded({
  extended: false
}));
// 解析 JSON
app.use(bodyParser.json());

// 挂载静态资源
app.use('/', express.static(__dirname + '/../html'));

// 配置 Multer

const multerConf = {
  storage: multer.diskStorage({

    // 设置文件保存路径
    destination: function (req, file, next) {
      next(null, '../uploads');
    },
    // 修改文件的名字
    filename: function (req, file, next) {
      console.log('the file is', file);
      // 记录后缀
      const ext = file.mimetype.split('/')[1];
      next(null, file.fieldname + '-' + Date.now() + '.' + ext);
    },
    // 确保只有一个文件上传的意义
    fileFilter: function (req, file, next) {
      if (!file) {
        next();
      }
      const image = file.mimetype.startsWith('image/');
      if (image) {
        console.log('photo uploaded');
        next(null, true);
      } else {
        console.log('file not supported');

        // 完善给用户的消息回应
        return next();
      }
    }
  })
}

// 添加路由
app.get('/', function (req, res) {
  res.render('index.html');
})

app.post('/upload', multer(multerConf).single('photo'), function (req, res) {
  res.send('ok')
})

app.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})