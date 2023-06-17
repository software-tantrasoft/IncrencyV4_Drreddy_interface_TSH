
class ExceptionAndriod {
    async andriodException(value) {
        try {
            /**
             * destructor 
             */
            let { errorType, message, location } = value;

            let exception = ({ errorType, message, location } = { "errorType": errorType, "message": message, "location": location });

            return {};
        } catch (error) {
            throw new Error(error);
        }


    }
}

module.exports = ExceptionAndriod;