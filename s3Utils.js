var AWS = require('aws-sdk');

var s3Utils = {
    
    s3: null,
    
    init: function() {
        AWS.config.loadFromPath('./AwsConfig.json');
        this.s3 = new AWS.S3();
    },

    fileExists: function(params, onexists, onnotexists) {
        this.s3.headObject(params, function(err, metadata) {  
            if (err && err.code === 'NotFound') {  
                onnotexists(); 
            } else {  
                onexists();
            }
        });
    },

    saveFile: function(params, onsuccess, onerror) {
        this.s3.upload(params, function(err, data) {
            if (err){
                onerror(err);
            } else {
                onsuccess(data);
            }
        });
    }
}

module.exports = s3Utils;