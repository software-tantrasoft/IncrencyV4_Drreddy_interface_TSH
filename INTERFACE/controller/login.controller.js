//packages
const requestIp = require('request-ip');
const Joi = require('joi');
//modules
const LoginSchema = require('../validation/login/login.Schema');
const LoginModal = require('../model/Login/login.model');
const globalData = require('../global/globalData');
//instances of respective classes
const objLoginModal = new LoginModal();


exports.loginApi = (req, res) => {

    var Ip = requestIp.getClientIp(req);
    const { err, value } = LoginSchema.ValidateApiLogin().validate(req.body);

        if (err) {           
            res.statusCode = 400;
            let responseObj= { status: 'Bad Request' , message: err.details[0].message.replace(/\"/g,"") }
            res.send(responseObj);
        }
        else {
            objLoginModal.loginApi(req.body)
                .then(result => {
                    if (result.status === 'success') {
                        res.statusCode = 200;
                        res.json(result)
                    }
                    else {
                        res.statusCode = 200;
                        res.json(result)
                    }
                }).catch(err => {
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
    }

exports.logout = (req, res) => {

    var responseObj = {}

    const { err, value } = LoginSchema.ValidateUserLogout().validate(req.body);
    
        if (err) {

            res.statusCode = 400;
            Object.assign(responseObj, { status: 'Bad Request' }, { message: err.details[0].message.replace(/\"/g,"") })
            res.send(responseObj);
        }
        else {
            objLoginModal.logout(req.body)
                .then(result => {
                    res.statusCode = 200
                    res.send(result);
                }).catch(err => {
                    console.log(err)
                    res.statusCode = 500;
                    Object.assign(responseObj, { status: 'fail' }, { message: 'Internal Server Error' })
                    res.send(responseObj);

                })
        }
}
// exports.logOutUser = (req, res) => {
//     Joi.validate(req.body, LoginSchema.ValidateUserLogout(), (err, value) => {
//         if (err) {
//             res.statusCode = 400;
//             let responseObj = {}
//             Object.assign(responseObj, {
//                 status: 'fail',
//                 message: err.details[0].message.replace(/"/g, "")
//             })
//             res.send(responseObj);
//         } else {
//             objLoginModal.logOut(value).then(ModelRes => {
//                 res.statusCode = 200;
//                 res.send(ModelRes);
//             }).catch(err => {
//                 console.log(err)
//                 res.statusCode = 500;
//                 let responseObj = {}
//                 Object.assign(responseObj, {
//                     status: 'fail',
//                     message: 'Internal server error'
//                 })
//                 res.send(responseObj);
//             })      }
//     })
// }
exports.powerBackup = (req, res) => {
    
    const { err, value } = LoginSchema.ValidatepowerBackup().validate(req.body);
        if (err) {
            res.statusCode = 400;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {

            // objLoginModal.powerbackupcheck(value)
            //     .then((result) => {
            //         if (result.status === 'success') {
            //             res.statusCode = 200;
            //             res.json(result)
            //         } else {
            //             res.statusCode = 200;
            //             res.json(result)
            //         }
            //     }).catch((err) => {
            //         console.log(err)
            //         res.statusCode = 500;
            //         let responseObj = {}
            //         Object.assign(responseObj, {
            //             status: 'fail',
            //             message: 'Internal server error'
            //         })
            //         res.send(responseObj);
            //     });
        }
}
//uncomment for powerbackup Rupali
// exports.ApiLogin = (req, res) => {
    exports.powerBackupData = (req, res) => {
    const { err, value } = LoginSchema.ValidatepowerBackup().validate(req.body);
        if (err) {
            res.statusCode = 400;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {

            objLoginModal.powerbackup(value)
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
  
}
exports.loginMain = (req, res) => {
    let Ip = requestIp.getClientIp(req);
    // Joi.validate(req.body, LoginSchema.ValidateUserCredential(), (err, value) => {
    //     if (err) {
    //         res.statusCode = 400;
    //         let responseObj = {}
    //         Object.assign(responseObj, {
    //             status: 'fail',
    //             message: err.details[0].message.replace(/"/g, "")
    //         })
    //         res.send(responseObj);
    //     } else {

    //     }



    // })


    objLoginModal.loginMain(req.body.userId, req.body.userPass, req.body.source, Ip, req.body.Hmi)
        .then((result) => {
            // if (result.status === 'success') {

            // } else {
            //     res.statusCode = 200;
            //     res.json(result)
            // }
            res.statusCode = 200;
            res.json(result)
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

exports.changePassword = (req, res) => {
    let responseObj = {}
    let Ip = requestIp.getClientIp(req);
    Joi.validate(req.body, LoginSchema.ValidateChangePassword(), (err, value) => {
        if (err) {
            res.statusCode = 400;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {
            objLoginModal.changePasswordRequest(req.body)
                .then((result) => {
                    if (result.status === 'success') {
                        res.statusCode = 200;
                        res.json(result)
                    } else {
                        res.statusCode = 200;
                        res.json(result)
                    }
                    // loggers.LoginApiLogger.info(JSON.stringify({ apiCalled: 'changePassword', objectSendByAndriod: req.body, resObj: result }));
                }).catch((err) => {
                    console.log(err)
                    res.statusCode = 500;
                    let responseObj = {}
                    Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
                    res.send(responseObj);
                })
        }
    })
}

exports.passwordComplexity = (req, res) => {
    let responseObj = {}
    let Ip = requestIp.getClientIp(req);
    objLoginModal.passwordComplexity()
        .then((result) => {
            if (result.status === 'success') {
                res.statusCode = 200;
                res.json(result)
            } else {
                res.statusCode = 200;
                res.json(result)
            }
            // loggers.LoginApiLogger.info(JSON.stringify({ apiCalled: 'changePassword',  resObj: result }));
        }).catch((err) => {
            console.log(err)
            res.statusCode = 500;
            let responseObj = {}
            Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
            res.send(responseObj);
        })
}


exports.getIDSNo = (req, res) => {
    let responseObj = {}
    //let Ip = requestIp.getClientIp(req);
    objLoginModal.getIDSNo(req)
        .then((result) => {
            if (result.status === 'success') {
                res.statusCode = 200;
                res.json(result)
            } else {
                res.statusCode = 200;
                res.json(result)
            }
            // loggers.LoginApiLogger.info(JSON.stringify({ apiCalled: 'changePassword',  resObj: result }));
        }).catch((err) => {
            console.log(err)
            res.statusCode = 500;
            let responseObj = {}
            Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
            res.send(responseObj);
        })
}

exports.getIDS = (req, res) => {
    let responseObj = {}
    //let Ip = requestIp.getClientIp(req);
    objLoginModal.getIDS(req)
        .then((result) => {
            if (result.status === 'success') {
                res.statusCode = 200;
                res.json(result)
            } else {
                res.statusCode = 200;
                res.json(result)
            }
            // loggers.LoginApiLogger.info(JSON.stringify({ apiCalled: 'changePassword',  resObj: result }));
        }).catch((err) => {
            console.log(err)
            res.statusCode = 500;
            let responseObj = {}
            Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
            res.send(responseObj);
        })
}

exports.communicationoff = (req, res) => {
    let responseObj = {}
    //let Ip = requestIp.getClientIp(req);
    objLoginModal.communicationOff(req.body)
        .then((result) => {
            if (result.status === 'success') {
                res.statusCode = 200;
                res.json(result)
            } else {
                res.statusCode = 200;
                res.json(result)
            }
            // loggers.LoginApiLogger.info(JSON.stringify({ apiCalled: 'changePassword',  resObj: result }));
        }).catch((err) => {
            console.log(err)
            res.statusCode = 500;
            let responseObj = {}
            Object.assign(responseObj, { status: 'fail' }, { message: 'Internal server error' })
            res.send(responseObj);
        })
}

exports.discardPowerBackup = (req, res) => {
    const { err, value } = LoginSchema.ValidateDiscardPowerBackup().validate(req.body);
        if (err) {
            res.statusCode = 400;
            let responseObj = {}
            Object.assign(responseObj, {
                status: 'fail',
                message: err.details[0].message.replace(/"/g, "")
            })
            res.send(responseObj);
        } else {

            objLoginModal.discardPowerBackup(value)
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
}