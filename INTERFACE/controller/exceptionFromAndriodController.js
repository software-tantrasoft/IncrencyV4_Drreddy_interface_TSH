const joi = require('joi')

 const clsAndriodExceptionSchema = require('../validation/andriodException/andriodException.Schema');
const clsAndriodException = require('../model/exceptionFromAndriod.model');
const objAndriodException = new clsAndriodException();



exports.andriodException = (req,res)=>{
    const objAndriodExceptionSchema = clsAndriodExceptionSchema.ValidateAndriodException(req.body);
    let responseObj = {};
    if(objAndriodExceptionSchema.hasOwnProperty('error')){
        res.statusCode = 400;
        Object.assign(responseObj, {
            status: 'fail',
            message: objAndriodExceptionSchema.error.message.replace(/"/g, "")
        })
        res.send(responseObj);
    }else{
        objAndriodException.andriodException(req.body).then(result => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            console.log(err)
            res.statusCode = 500;
            Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
            res.send(responseObj);
        })
    
    }
}