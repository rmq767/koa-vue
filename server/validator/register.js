const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateRegister(data){
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.checkpwd = !isEmpty(data.checkpwd) ? data.checkpwd : ''

    if(!validator.isLength(data.name,{min:2 , max:10})){
        errors.name = '名字的长度不能小于2位且不超过10位'
    }
    if(validator.isEmpty(data.name)){
        errors.name = '名字不能为空'
    }
    if(validator.isEmpty(data.email)){
        errors.email = '邮箱不能为空'
    }
    if(!validator.isEmail(data.email)){
        errors.email = '邮箱不合法'
    }
    if(!validator.isLength(data.password,{min:6 , max:20})){
        errors.password = '密码的长度不能小于6位且不超过20位'
    }
    if(validator.isEmpty(data.password)){
        errors.password = '密码不能为空'
    }
    if(validator.isEmpty(data.checkpwd)){
        errors.checkpwd = '确认密码不能为空'
    }
    if(!validator.equals(data.checkpwd,data.password)){
        errors.checkpwd = '两次密码不一致'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}