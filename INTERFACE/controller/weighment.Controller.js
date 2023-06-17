const joi = require('joi')

const clsWeighmentSchema = require('../validation/weighment/weighment.Schema')
const clsWeighmentModel = require('../model/clsProcessWeighment.model');
const objWeighmentMOdel = new clsWeighmentModel();


exports.onTestStart = (req, res) => {
    if (req.body.menuName != "IPCWC") {
        var objWeighment = clsWeighmentSchema.ValidateTestStart(req.body);
    }else{
        var objWeighment = clsWeighmentSchema.ValidateIPCTestStart(req.body);
    }


    let responseObj = {};
    if (objWeighment.hasOwnProperty('error')) {
        res.statusCode = 400;
        Object.assign(responseObj, {
            status: 'fail',
            message: objWeighment.error.message.replace(/"/g, "")
        })
        res.send(responseObj);
    } else {
        objWeighmentMOdel.OnTestStart(req.body).then(result => {
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

exports.doubleRotary = (req,res)=>{
    joi.validate(req.body, clsWeighmentSchema.ValidateDoubleRotary(), function (err, value) {
        if (err) {
            res.statusCode = 400;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {

            objWeighmentMOdel.doubleRotary(value)
                .then((result) => {
                    if (result.status === 'success') {
                        res.statusCode = 200;
                        res.json(result)
                    } else {
                        res.statusCode = 200;
                        res.json(result)
                    }
                }).catch((err) => {
                    console.log(err)
                    res.statusCode = 500;
                    let responseObj = {}
                    Object.assign(responseObj, {
                        status: 'fail',
                        message: 'Internal server error'
                    })
                    res.send(responseObj);
                });
        }
    })


}
exports.verifyTestUser = (req,res)=>{
    var objWeighment = clsWeighmentSchema.ValidateVerifyTestUser(req.body);
    let responseObj = {};
    if (objWeighment.hasOwnProperty('error')) {
        res.statusCode = 400;
        Object.assign(responseObj, {
            status: 'fail',
            message: objWeighment.error.message.replace(/"/g, "")
        })
        res.send(responseObj);
    } else {
        objWeighmentMOdel.verifyLoginAfterTest(req.body).then(result => {
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