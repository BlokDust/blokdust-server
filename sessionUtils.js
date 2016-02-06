var md5 = require('md5');
var privateConfig = require('./privateConfig');

var sessionUtils = {
    getSessionId: function(compositionId){
        var sessionId = privateConfig.sessionSalt;
        sessionId += compositionId;
        return md5(sessionId);
    }
}

module.exports = sessionUtils;