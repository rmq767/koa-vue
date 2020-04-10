const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateRegister(data){
    let errors = {}
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

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
    return{
        errors,
        isValid:isEmpty(errors)
    }
}