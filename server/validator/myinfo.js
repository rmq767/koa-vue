const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateInfo(data){
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.signature = !isEmpty(data.signature) ? data.signature : ''

    if(!validator.isLength(data.name,{min:2 , max:8})){
        errors.name = '名字的长度不能小于2位且不超过8位'
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
    if(!validator.isLength(data.signature,{min:1 , max:200})){
        errors.signature = '签名的长度不能小于1位且不超过200位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}