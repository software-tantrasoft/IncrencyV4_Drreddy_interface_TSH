const winston = require('winston');
const date = require('date-and-time');

const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.align(),
    winston.format.simple(),
    winston.format.printf(info => `${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss a')} Log => ${info.message}`)
)


const loggers = {
    MqttProtocolLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/mqttProtocols.log' }),
        format: format,
        level: 'info',
    }),
    NodeToAndroidProtocolsLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/NodeToAndroidProtocols.log' }),
        format: format,
        level: 'info',
    }),
    WeighmentErrorLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/WeighmentError.log' }),
        format: format,
        level: 'error',
    }),
    CalibrationErrorLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/CalibrationError.log' }),
        format: format,
        level: 'error',
    }),
    MenuListErrorLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/MenuListError.log' }),
        format: format,
        level: 'error',
    }),
    loginErrorLogger: winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/loginErrorLogger.log' }),
        format: format,
        level: 'error',
    }),
    calibrationApiLogger : winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/calibrationApiLogger.log' }),
        format: format,
        level: 'info',
    }),
    LoginApiLogger : winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/loginApiLogger.log' }),
        format: format,
        level: 'info',
    }),
    menuRequestApi : winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/menuRequestApi.log' }),
        format: format,
        level: 'info',
    }),
    weighmentApiLogger : winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/weighmentApiLogger.log' }),
        format: format,
        level: 'info',
    }),
    andriodExceptionLogger : winston.createLogger({
        transports: new winston.transports.File({ filename: './logs/andriodExceptionLogger.log' }),
        format: format,
        level: 'info',
    })

}

module.exports = loggers;