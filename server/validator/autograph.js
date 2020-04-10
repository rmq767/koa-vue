const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateAutograph(data){
    let errors = {}
    data.autograph = !isEmpty(data.autograph) ? data.autograph : ''
    
    if(validator.isEmpty(data.autograph)){
        errors.autograph = '签名不能为空'
    }
    if(!validator.isLength(data.autograph,{min:1 , max:200})){
        errors.autograph = '签名的长度不能小于1位且不超过200位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}