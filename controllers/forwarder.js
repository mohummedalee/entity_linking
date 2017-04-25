var request = require('request');

// forwards text to ambiverse for processing; returns processed response
function forward(req, res){
    // set up options for the request to ambiverse
    var options = {
        method: 'POST',
        url: 'https://api.ambiverse.com/v1/entitylinking/analyze',
        headers: {
            authorization: 'Bearer ' + req.app.locals.access_token,
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: { "text": req.body.text },
        json: true,
        gzip: true
    };
    // send request and respond. any needed preprocessing should go here
    request(options, function (err, response, body){
        if(!err && response.statusCode == 200){
            return res.status(200).send(body);
        }
        else {
            return res.status(500).send({'error': 'Ambiverse did not respond correctly.'});
        }
    });
}

// expose endpoint(s)
exports.forward = forward;
