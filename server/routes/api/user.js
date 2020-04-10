const Router = require('koa-router')
const router = new Router()
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
const passport = require('koa-passport')
const nodemailer = require('nodemailer')

// 引入验证
const validateRegister = require('../../validator/register')
const validateLogin = require('../../validator/login')

// POST /api/user/getcode
// 公开的
router.post('/getcode',async (ctx,next) => {
    let email = ctx.request.body.email
    let randomVerify = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
    ctx.session.randomVerify = randomVerify  //session保存验证码
    let transporter = nodemailer.createTransport({
        service:'qq',
        auth:{
            user:'2501706076@qq.com',
            pass:'zjuzbayntywldjic'//授权码，QQ获取
        }
    })
    let mailOptions = {
        from: '2501706076@qq.com', // 发送者
        to: email, // 接受者,可以同时发送多个,以逗号隔开
        subject: '亿柒科技', // 标题
        //text: 'Hello world', // 文本
        html: `验证码为：` + randomVerify,
        // attachments: [{
        //     filename: 'picturn',
        //     path: './clint/src/assets/scenery5.jpg'
        // }]
    }
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            ctx.throw(500,'验证码发送错误')
        }
    })
    ctx.body = {randomVerify}
    await next()
})

// POST /api/user/register
// 公开的
router.post('/register',async ctx => {
    const {errors, isValid} = validateRegister(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let randomVerify = ctx.session.randomVerify //获取session中的验证码
    let email = ctx.request.body.email
    let userVerify = ctx.request.body.verify
    let password = md5(ctx.request.body.password)//md5加密
    let checkpwd = md5(ctx.request.body.checkpwd)//md5加密
    let findEmail = await ctx.db.query(`SELECT * FROM koa1_user WHERE email='${email}'`)
    if(findEmail.length > 0){
        ctx.throw(500,'邮箱已注册')
    }else if(randomVerify != userVerify){
        ctx.throw(500,'验证码不同')
        console.log('验证码不同')
    }else if(password != checkpwd){
        ctx.throw(500,'两次输入密码不同')
        console.log('验证码不同')
    }else{
        //  没查到邮箱
        let user = {
        name : ctx.request.body.name,
        email : ctx.request.body.email,
        password,
        }
        //  向数据库插入数据
        ctx.db.query(`INSERT INTO koa1_user (name,email,password) VALUES ('${user.name}','${user.email}','${user.password}')`)
    }
    //  从数据库拿数据，需要异步执行，不然会是空
    let data = await ctx.db.query(`SELECT * FROM koa1_user`)
    ctx.response.body = data
})

// POST /api/user/login
// 公开的
router.post('/login', async ctx => {
    const {errors, isValid} = validateLogin(ctx.request.body)
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    // 查询用户
    let password = ctx.request.body.password
    let findEmail = await ctx.db.query(`SELECT * FROM koa1_user WHERE email='${ctx.request.body.email}'`)
    // 判断查没查到
    if(findEmail.length == 0){
        ctx.throw(404,'用户不存在')
    }else{
        // 查到后验证密码
        if(findEmail[0].password == md5(password)){
            //  生成token
            const payLoad = {id:findEmail[0].id,name:findEmail[0].name,email:findEmail[0].email}
            const token = jwt.sign(payLoad,keys.secretOrKey,{expiresIn:1000*60*60*24})
            
            ctx.status = 200
            ctx.body = {token:'Bearer '+token}//这里的token必须要,并且有空格
        }else{
            ctx.throw(40103,'密码错误')
        }
    }
})

// GET /api/user/current
// private
router.get('/current',passport.authenticate('jwt', { session: false }),async ctx => {
    // 接受passport.js传过来的user
    ctx.body = ctx.state.user[0]
})

module.exports = router.routes()//一定注意routes