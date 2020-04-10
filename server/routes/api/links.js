const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

const validateLink = require('../../validator/links')

// post /api/links/add
// private
// 添加链接
router.post('/add',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateLink(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let name = ctx.request.body.name
    let link = ctx.request.body.link
    try {
        await ctx.db.query(`insert into links (name,link) values('${name}','${link}')`)
        let data = await ctx.db.query('select * from links')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// post /api/links/delete/:id
// private
// 添加链接
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        await ctx.db.query(`delete from links where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/links/select
// private
// 获取链接
router.get('/select',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query('select * from links')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/links/select/:id
// private
// 获取单个链接
router.get('/select/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        let data = await ctx.db.query(`select * from links where id='${id}'`)
        ctx.body = data[0]
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/links/select3/
// private
// 获取最新的3个公告
router.get('/select3/',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query(`SELECT * FROM links ORDER BY id DESC LIMIT 3;`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// put /api/links/edit/:id
// private
// 更新links
router.put('/edit/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateLink(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let id = ctx.params.id
    let name = ctx.request.body.name
    let link = ctx.request.body.link
    try {
        await ctx.db.query(`UPDATE links SET name='${name}',link='${link}' where id='${id}'`)
        let data = await ctx.db.query(`select * from links where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

module.exports = router.routes()//一定注意routes