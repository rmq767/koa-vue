const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

const validateAutograph = require('../../validator/autograph')

// post /api/autograph/add
// private
// 添加链接
router.post('/add',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateAutograph(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let autograph = ctx.request.body.autograph
    try {
        await ctx.db.query(`insert into autographs (autograph) values('${autograph}')`)
        let data = await ctx.db.query('select * from autographs')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// post /api/autograph/delete/:id
// private
// 添加链接
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        await ctx.db.query(`delete from autographs where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/autograph/select
// private
// 获取链接
router.get('/select',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query('select * from autographs')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/autograph/select/:id
// private
// 获取单个链接
router.get('/select/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        let data = await ctx.db.query(`select * from autographs where id='${id}'`)
        ctx.body = data[0]
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/autograph/selectnew/
// private
// 获取最新的1个签名
router.get('/selectnew/',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query(`SELECT * FROM autographs ORDER BY id DESC LIMIT 1;`)
        ctx.response.body = data[0]
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// put /api/autograph/edit/:id
// private
// 更新autograph
router.put('/edit/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateAutograph(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let id = ctx.params.id
    let autograph = ctx.request.body.autograph
    try {
        await ctx.db.query(`UPDATE autographs SET autograph='${autograph}' where id='${id}'`)
        let data = await ctx.db.query(`select * from autographs where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

module.exports = router.routes()//一定注意routes