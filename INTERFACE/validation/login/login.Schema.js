const Joi = require('joi');

class LoginSchema {
    static ValidateApiLogin() {
        
            const LoginMainSchema = Joi.object().keys({
                Hmi: Joi.string().required().trim().not('', null,'undefined'),
                userId: Joi.string().required().trim().not('',null,'undefined'),
                userPass: Joi.string().required().trim().not('',null,'undefined'),
                respbi: Joi.string().required().trim().not('',null,'undefined'),
            });
            
            return LoginMainSchema;
        }

    static ValidatepowerBackup(){
        const pwerBcupSchema =  Joi.object().keys({
            Hmi: Joi.string().required().trim().not('', null,'undefined'),
            userId: Joi.string().required().trim().not('', null,'undefined'),  
        });
        return pwerBcupSchema;
    }
    static ValidateUserCredential(value) {
        const ValidateSchema = Joi.object().keys({
            Hmi:Joi.string().required().not(null).required(),
            userId:Joi.string().required().not(null).required(),
            userPass:Joi.string().required().not(null).required(),
            source:Joi.string().required().not(null).required()
        })
        return ValidateSchema.validate(value);
    }

    static ValidateUserLogout(value) {
        const ValidateSchema = Joi.object().keys({
            Hmi: Joi.string().trim().required().not('', null, 'undefined'),
            userId: Joi.string().trim().required().not('', null,'undefined'),
            userName: Joi.string().trim().required().not('', null, 'undefined'),
            resbpi:Joi.string().trim().required().not('', null, 'undefined'),
            autoLogout:Joi.boolean().required(),
        })
        return ValidateSchema;

    }

    // static ValidateUserLogout(value) {
    //     const ValidateSchema = Joi.object({
    //         Hmi: Joi.string().required().not(null),
    //         userId: Joi.string().required().not(null),
    //         userName: Joi.string().required().not(null)

    //     })
    //     return ValidateSchema.validate(value);
        
    // }

    static ValidateChangePassword(value){
        const ValidateSchema = Joi.object({
           Hmi:Joi.string().required().not(null), 
           userId:Joi.string().required().not(null), 
        //    oldPassword:Joi.string().required().not(null),
           newPassword:Joi.string().required().not(null),

        })

        return ValidateSchema.validate(value)
    }

    static ValidateDiscardPowerBackup() {

        const LoginMainSchema = Joi.object().keys({
            Hmi: Joi.string().required().trim().not('', null,'undefined'),
            userId:Joi.string().required().trim().not('', null,'undefined'),
            userName:Joi.string().required().trim().not('', null,'undefined'),
            menuName:Joi.string().required().trim().not('', null,'undefined'),
        });

        return LoginMainSchema;
    }
}
module.exports = LoginSchema;