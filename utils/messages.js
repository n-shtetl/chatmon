const moment = require('moment');


function formatMessage(username, msg) {
    return {
        username,
        msg,
        timestamp: moment().format('h:mm a')
    }
}

module.exports = formatMessage;