## 2019.10.9
### 今日问题

+ 在配置dbconfig时,co没有包裹conn
```javascript
    let conn = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'19980327',
    database:'node1'
})
module.exports = co(conn)
```

+ 配置全局路由与配置单个路由区别(app  router)
```javascript
// 全局
app.use(router.routes()).use(router.allowedMethods())
// 单个
const user = require('./routes/api/user')
router.use('/api/user',user)
```
+ ![这是图片](https://i2.hdslb.com/bfs/face/9a5156d0f4f23ddc029a66e7ed2b34c9912ab2b6.jpg@72w_72h.webp "123")

+ 查询数据库时问题
    - 注意数据长度
    - 注意await
    - 语句是否正确
    - select才能返回数据


## 2019.10.10
### 今日问题

+ 异步操作与同步操作
    - 数据库操作一般都是异步
    - 异步同步 是针对数据来说的  对一个数据的查询如果是异步操作  那么对一个数据的修改也最好要用异步操作  以保证指令按顺序到达
      >比如下面一个场景
      >玩家A重复购买10积分的物品两次 且玩家只有10积分
      >如果是同步查询 异步修改的话  很可能会出现玩家A的数据库积分变成负数的情况 
      >上面这个情况  因为第一个查询是肯定在第一时间执行 这个时候数据合法性是正确的  而第二个查询如果也使用同步的话  很可能也会在 第一个修改操作到达之前执行 这样逻辑上判断第二个修改操作也是合法的
      >所以对数据的同步异步操作最好不要分离
      >或者尽量使用异步查询 同步更新这样的逻辑
      >但是最理想的情况是 由异步操作把数据一次性全部读入内存  在内存中建立数据的状态标记
      >这个时候只需要轮询是否数据被修改 然后异步更新被修改的数据就可以了。

+ 数据库语句的书写
```javascript
// 查询
let findEmail = await ctx.db.query(`SELECT * FROM koa1_user WHERE email='${email}'`)
// 插入
ctx.db.query(`INSERT INTO koa1_user (name,email,password,avatar) VALUES ('${user.name}','${user.email}','${user.password}','${user.avatar}')`)
// 更新

// 删除

``` 

+ token的生成
```javascript
// 需要 npm i jsonwebtoken
// const jwt = require('jsonwebtoken')
//  生成token
const payLoad = {email:findEmail[0].email,password:findEmail[0].password}
const token = jwt.sign(payLoad,keys.secretOrKey,{expiresIn:3600})

ctx.body = {token:'Bearer '+token}//这里的token必须要,并且有空格
```

+ 加密问题
    - 在加密的时候，需要在赋值时加密，否则会有异步问题，存到数据库密码还是没有加密

+ 获取头像
```javascript
// 需要 npm i gravatar
// const gravatar = require('gravatar')
gravatar.url(ctx.request.body.email,{s:'200',r:'pg',d:'mm'})
```

## 2019.10.15
### 今日重点

+ passport使用，验证token
```javascript
// 1.安装npm i koa-passport passport-jwt

// 2.使用koa-passport
//  routes/api/user.js
const passport = require('koa-passport')

router.get('/current',passport.authenticate('jwt', { session: false }),async ctx => {
    // 接受passport.js传过来的user
    ctx.body = ctx.state.user
})

// 3.使用passport-jwt
// config/passport.js
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./key') 
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const db = require('../dbconfig')

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts,async function(jwt_payload, done) {
            const user = await db.query(`SELECT * FROM koa1_user WHERE id=${jwt_payload.id}`)
            if(user){
                // 返回查询到的user
                return done(null,user)
            }else{
                return done(null,false)
            }
    }));
}
```

```javascript
// 邮箱验证
// 安装npm i nodemailer
const nodemailer = require('nodemailer')
const randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);//全局生成6位验证码

router.post('/getcode',async ctx => {
    let email = ctx.request.body.email
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
        html: `验证码为：` + randomNum,
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
    ctx.body = {randomNum}
})
```

+ session保存验证码
```javascript
//npm i koa-session
// app.js
const session = require('koa-session')
app.keys = ['some secret hurr']; // 签名 默认
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// routes/api/user.js
let randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);//全局生成验证码，方便验证
ctx.session.randomNum = randomNum  //session保存验证码

let randomNum = ctx.session.randomNum //获取session中的验证码
```

+ 遇到的问题
    - 在passport.js导入数据库问题
    - opts.secretOrKey = keys.secretOrKey;（忘记加.secretOrKey）
    - await忘了写

