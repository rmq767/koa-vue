const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

const validateNotice = require('../../validator/notice')

// post /api/notice/add
// private
// 添加公告
router.post('/add',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateNotice(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let time = ctx.request.body.time
    let content = ctx.request.body.content
    try {
        await ctx.db.query(`insert into notice (time,content) values('${time}','${content}')`)
        let data = await ctx.db.query('select * from notice')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// post /api/notice/delete/:id
// private
// 删除公告
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        await ctx.db.query(`delete from notice where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/notice/select
// private
// 获取公告
router.get('/select',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query('select * from notice')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/notice/select/:id
// private
// 获取单个公告
router.get('/select/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        let data = await ctx.db.query(`select * from notice where id='${id}'`)
        ctx.body = data[0]
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/notice/select3/
// private
// 获取最新的3个公告
router.get('/select3/',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query(`SELECT * FROM notice ORDER BY id DESC LIMIT 3;`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// put /api/notice/edit/:id
// private
// 更新公告
router.put('/edit/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    let time = ctx.request.body.date
    let content = ctx.request.body.content
    try {
        await ctx.db.query(`UPDATE notice SET time='${time}',content='${content}' where id='${id}'`)
        let data = await ctx.db.query(`select * from notice where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

module.exports = router.routes()//一定注意routes