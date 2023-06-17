const moment = require('moment-timezone')

function convertDate(dateInUTCFormat) { 
    return new Promise((resolve, reject) => { 
        var dec = moment(dateInUTCFormat);
        var normalDate = dec.tz('Asia/Kolkata').format('YYYY-MM-DD');  // GMT +5:30 (India)
        resolve(normalDate);
    }) 
}
module.exports.convertDate = convertDate;
