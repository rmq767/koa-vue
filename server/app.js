const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')//解析请求体
const passport = require('koa-passport')//token
const session = require('koa-session')
const cors = require('koa-cors')
const static = require('koa-static')//获取静态资源
const path = require('path')

// 实例化koa
const app = new Koa()
const router = new Router()
app.use(bodyParser({
    multipart: true, // 支持文件上传
}));

app.use(static(
    path.join(__dirname, './upload')//获取static文件夹下的资源，url不加static http://localhost:3000/avatar.png
))
// router.all(/(\.jpg|\.png|\.gif)$/i,static('./upload',{
//     maxage:60*86400*1000
// }))
// router.all(/(\.css)$/i,static('./upload',{
//     maxage:1*86400*1000
// }))
// router.all('',static('./upload',{
//     maxage:30*86400*1000
// }))

// 实现跨域
app.use(cors({
    credentials: true
}))

// 设置session用来保存验证码
app.keys = ['some secret hurr']; // 签名 默认
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    // rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: true, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// 连接数据库
app.context.db = require('./dbconfig')

app.use(passport.initialize())
app.use(passport.session())
// 回调config文件中的passport.js
require('./config/passport')(passport)

// 配置路由地址localhost:3000/api/user
const user = require('./routes/api/user')
router.use('/api/user',user)
// 配置路由地址localhost:3000/api/article
const article = require('./routes/api/article')
router.use('/api/article',article)
// 配置路由地址localhost:3000/api/userinfo
const userinfo = require('./routes/api/myinfo')
router.use('/api/userinfo',userinfo)
// 配置路由地址localhost:3000/api/study
const study = require('./routes/api/study')
router.use('/api/study',study)
// 配置路由地址localhost:3000/api/messages
const messages = require('./routes/api/messages')
router.use('/api/messages',messages)
// 配置路由地址localhost:3000/api/notice
const notice = require('./routes/api/notice')
router.use('/api/notice',notice)
// 配置路由地址localhost:3000/api/links
const links = require('./routes/api/links')
router.use('/api/links',links)
// 配置路由地址localhost:3000/api/autograph
const autograph = require('./routes/api/autograph')
router.use('/api/autograph',autograph)


// 配置路由
app.use(router.routes())
app.use(router.allowedMethods());

app.listen(3000,() =>{
    console.log('端口3000')
})