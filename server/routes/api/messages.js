const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

const validateMessage = require('../../validator/message')//验证请求体

// post /api/messages/add
// private
// 添加留言
router.post('/add',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateMessage(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let message = ctx.request.body.message
    let year = new Date().getFullYear()
    let month = new Date().getMonth()+1
    let day = new Date().getDate()
    let date = year+'-'+month+'-'+day
    let size = Math.floor(Math.random()*30+12) + 'px'
    let top = Math.floor(Math.random()*95) + '%'
    let left = Math.floor(Math.random()*95) + '%'
    try {
        await ctx.db.query(`insert into messages (time,message,r_size,r_top,r_left) values('${date}','${message}','${size}','${top}','${left}')`) 
        ctx.response.body = "添加成功"
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/messages/select
// private
// 加载留言
router.get('/select',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query(`SELECT * FROM messages ORDER BY id DESC LIMIT 30;`)     
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// post /api/messages/delete/:id
// private
// 添加链接
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        await ctx.db.query(`delete from messages where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})
module.exports = router.routes()//一定注意routes