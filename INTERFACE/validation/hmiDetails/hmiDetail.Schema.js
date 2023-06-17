const Joi = require('joi');

class HmiSchema {

    static ValidateHmiStatus() {
        const ValidateSchema = Joi.object().keys({
            hmi: Joi.string().required().not(['',null,'undefined']),
        })
        return ValidateSchema;
    }

   

}
module.exports = HmiSchema;