//packages
const Joi = require('joi');

class WeighmentSchema {

    static ValidateTestStart() {
        const validateSchema = Joi.object().keys({
            Hmi:Joi.string().required().trim().not('', null,'undefined'),
            userId: Joi.string().required().trim().not('', null,'undefined'),
            userName: Joi.string().required().trim().not('', null,'undefined'),
            menuName: Joi.string().required().trim().not('', null,'undefined'),
            noOfSample : Joi.string().not(null).required().allow(''),
            Rotary: Joi.string().required().trim().not('', null,'undefined'),
            Side: Joi.string().required().trim().not('', null,'undefined'),
            ProductId: Joi.string().required().trim().not('', null,'undefined'),
            ProductName: Joi.string().required().trim().not('', null,'undefined'),
            Batch: Joi.string().required().trim().not('', null,'undefined'),
            Nominal: Joi.string().required().trim().not('', null,'undefined'),
            Dp: Joi.string().required().trim().not('', null,'undefined'),
            T1Neg: Joi.string().required().trim().not('', null,'undefined'),
            T1Pos: Joi.string().required().trim().not('', null,'undefined'),
            T2Neg: Joi.string().not(null).required().allow(''),
            T2Pos: Joi.string().not(null).required().allow(''),
            // column: Joi.array().not(null).allow(''),
            // type: Joi.string().not(null).allow(''),
            // LotNo: Joi.string().not(null),
            AirVibrationLimit: Joi.string().required().trim().not('', null,'undefined'),
            editableSide: Joi.boolean().not(null).allow(''),
            editableSampleNo: Joi.boolean().not(null).allow(''),
        })
        return validateSchema
    }
    static ValidateDoubleRotary() {
    const doubledata = Joi.object().keys({
        Hmi: Joi.string().required().not(['', null,'undefined']),
        Side: Joi.string().required().not(['',null,'undefined']),
    });
    return doubledata;
}

    static ValidateIPCTestStart(value){
        const validateIpcSchema = Joi.object({
            Hmi: Joi.string().required().not([null, 'undefined']),
            userid: Joi.string().required().not([null, 'undefined']),
            userName: Joi.string().required().not([null, 'undefined']),
            menuName: Joi.string().required().not([null, 'undefined']),
            BFGCode: Joi.string().required().not([null, 'undefined']),
            ProdName: Joi.string().required().not([null, 'undefined']),
            ProdVersion: Joi.string().required().not([null, 'undefined']),
            Version: Joi.string().required().not([null, 'undefined']),
            batch: Joi.string().required().not([null, 'undefined']),
            TareWt: Joi.string().required().not([null, 'undefined']),
            menuName: Joi.string().required().not([null, 'undefined']),

        })

        return validateIpcSchema.validate(value);
    }

   static ValidateVerifyTestUser(value){
        const validateIpcSchema = Joi.object({
            Hmi: Joi.string().required().not([null, 'undefined']),
            userId: Joi.string().required().not([null, 'undefined']),
            userPass: Joi.string().required().not([null, 'undefined']),
        })

        return validateIpcSchema.validate(value);
    }

}

module.exports = WeighmentSchema;
