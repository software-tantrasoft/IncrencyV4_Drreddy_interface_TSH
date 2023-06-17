const moment = require('moment-timezone');
/**
 * @description Function converts the TZ format to `YYYY-MM-DD` format
 * using `Asia/Kolkata`, `GMT +5:30 (India)` Timezone
 * @param {*} dateInUTCFormat 2019-04-08T10:03:17.078Z
 */
function convertDate(dateInUTCFormat) {
        var dec = moment(dateInUTCFormat);
        var normalDate = dec.tz('Asia/Kolkata').format('YYYY-MM-DD');  // GMT +5:30 (India)
        return normalDate;
}

/**
 * @description Function converts the TZ format to `HH:mm:ss` format
 * using `Asia/Kolkata`, `GMT +5:30 (India)` Timezone
 * @param {*} dateInUTCFormat 2019-04-08T10:03:17.078Z
 */
function convertTime(dateInUTCFormat) {
        var dec = moment(dateInUTCFormat);
        var normalDate = dec.tz('Asia/Kolkata').format('HH:mm:ss');  // GMT +5:30 (India)
        return normalDate;
}
/**
 * @description Function converts the TZ format to `YYYY-MM-DD HH:mm:ss` format
 * using `Asia/Kolkata`, `GMT +5:30 (India)` Timezone
 * @param {*} dateInUTCFormat 2019-04-08T10:03:17.078Z
 */
function convertDateTime(dateInUTCFormat) {
        var dec = moment(dateInUTCFormat);
        var normalDate = dec.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');  // GMT +5:30 (India)
        return normalDate;
}
module.exports.convertDate = convertDate;
module.exports.convertTime = convertTime;
module.exports.convertDateTime = convertDateTime;