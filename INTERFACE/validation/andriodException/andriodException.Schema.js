const Joi = require('joi')

class AndriodException {
    static ValidateAndriodException(value) {
        const ValidateAndriodExceptionSchema = Joi.object().keys({
            errorType: Joi.string().required(),
            message : Joi.string().required(),
            location : Joi.string().required(),
        })
        return ValidateAndriodExceptionSchema.validate(value);
    }
}

module.exports = AndriodException;