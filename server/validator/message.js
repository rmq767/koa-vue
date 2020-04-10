const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateMessage(data){
    let errors = {}
    data.message = !isEmpty(data.message) ? data.message : ''
    
    if(validator.isEmpty(data.message)){
        errors.message = '留言不能为空'
    }
    if(!validator.isLength(data.message,{min:1 , max:200})){
        errors.message = '留言的长度不能小于1位且不超过200位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}