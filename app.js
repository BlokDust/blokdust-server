var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var json = require('express-json');
var sessionUtils = require('./sessionUtils');
var s3Utils = require('./s3Utils');
var shortid = require('shortid');
var app = express();

app.set('port', config.server.port);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(json());

s3Utils.init();

app.post('/save', function(req, res) {
    var body = req.body;
    var id = body.Id;
    var sessionId = body.SessionId;
    var params;

    // if updating an existing file
    if (id) {
        // if a sessionId hasn't been passed, throw an unauthorized error
        if (!sessionId){
            res.status(401).send('Unauthorized');
        } else {
            var match = sessionUtils.getSessionId(id);
            
            // if a sessionId has been passed, but it doesn't match, throw an unauthorized error.
            if (sessionId != match) {
                res.status(401).send('Unauthorized');
            } else {
                params = {Bucket: config.AWS.bucket, Key: 'compositions/' + id};                

                s3Utils.fileExists(params, function() {
                    // if it exists, save over it
                    params.Body = body.Data;
                    s3Utils.saveFile(params, function() {
                        // save succeeded, return success message
                        res.status(200).send({
                            Id: id,
                            Message: "Saved",
                            SessionId: sessionId
                        }),
                        function() {
                            // save error
                            res.status(500).send('Error');
                        }
                    })},
                    function() {
                        // file doesn't exist
                        res.status(404).send('Not found');
                    });                    
            }
        }
    } else {
        // saving new file

        // if > 200k, reject
        if (Buffer.byteLength(body.Data, 'utf8') > 200000){
            res.status(413).send('File too large');
        } else {
            // generate ids
            id = shortid.generate();            
            sessionId = sessionUtils.getSessionId(id);
            
            params = {Bucket: config.AWS.bucket, Key: 'compositions/' + id, Body: body.Data};
            
            s3Utils.saveFile(params, function() {
                // save succeeded, return success message
                res.status(200).send({
                    Id: id,
                    Message: "Saved",
                    SessionId: sessionId
                }),
                function() {
                    // save error
                    res.status(500).send('Error');
                }
            });
        }
    }
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});