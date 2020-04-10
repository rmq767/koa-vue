const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./key') 
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
// 引入数据库
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