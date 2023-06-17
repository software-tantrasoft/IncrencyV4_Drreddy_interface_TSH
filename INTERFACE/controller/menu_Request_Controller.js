
//packages
const Joi = require('joi')

//models
const menuRequestModel = require('../model/Menu/MenuRequest.model');
const menuSchema = require('../validation/menu/menu.Schema');

//instance of respective classes
const objMenuRequestModel = new menuRequestModel();

exports.getMenu = (req, res) => {
    let responseObj = {};
    const { err, value } = menuSchema.ValidateGetMenu().validate(req.body);
    if (err) {
        res.statusCode = 400;
        Object.assign(responseObj, {
            status: 'fail',
            message: err.details[0].message.replace(/"/g, "")
        })
        res.send(responseObj);
    } else {
        objMenuRequestModel.getMenu(req.body).then(ModelRes => {
            res.statusCode = 200;
            res.send(ModelRes);
        }).catch(err => {
            console.log(err)
            res.statusCode = 500;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: 'Internal server error'
            })
            res.send(responseObj);
        })
    }
}

exports.subGetMenu = (req, res) => {
    let responseObj = {};
    Joi.validate(req.body, menuSchema.ValidatesubGetMenu(), (err, value) => {
        if (err) {
            res.statusCode = 400;
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {
            objMenuRequestModel.subGetMenu(req.body).then(ModelRes => {
                res.statusCode = 200;
                res.send(ModelRes);
            }).catch(err => {
                console.log(err)
                res.statusCode = 500;
                let responseObj = {}
                Object.assign(responseObj, {
                    status: 'fail',
                    message: 'Internal server error'
                })
                res.send(responseObj);
            })
        }
    })
}

exports.onMenuStart = (req, res) => {

    let responseObj = {};
    const { err, value } = menuSchema.ValidateGetMenu().validate(req.body);
        if (err) {
            res.statusCode = 400;
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {
            objMenuRequestModel.onMenuStart(value).then(ModelRes => {
                res.statusCode = 200;
                res.send(ModelRes);
            }).catch(err => {
                console.log(err)
                res.statusCode = 500;
                Object.assign(responseObj, {
                    status: 'fail',
                    message: 'Internal server error'
                })
                res.send(responseObj);
            })
        }
}