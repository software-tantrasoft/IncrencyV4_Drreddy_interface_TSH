//packages
const Joi = require('joi');

class MenuSchema {

    static ValidateGetMenu(value) {
        const ValidateSchema = Joi.object({
            Hmi:Joi.string().trim().required().not('', null, 'undefined'),
            userId :Joi.string().trim().required().not('', null, 'undefined'),
            userName : Joi.string().trim().required().not('', null, 'undefined'),
        })
        return ValidateSchema;
    }

    static ValidatesubGetMenu(value) {
        const ValidateSchema = Joi.object({
            Hmi:Joi.string().trim().required().not('', null, 'undefined'),
            userId :Joi.string().trim().required().not('', null, 'undefined'),
            userName : Joi.string().trim().required().not('', null, 'undefined'),
            menuName: Joi.string().trim().required().not('', null, 'undefined'),
        })
        return ValidateSchema;
    }

    static ValidateOnMenuStart(value) {
        const ValidateSchema = Joi.object({
            Hmi: Joi.string().required().not(['', null, 'undefined']),
            menuName: Joi.string().required().not(['', null, 'undefined']),

        })
        return ValidateSchema;
    }
}

module.exports = MenuSchema;
