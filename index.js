"use strict"

var express = require('express'); //
var app = express(); //


app.listen(process.env.PORT || 5000, function () {
    console.log('Server listening');

});

var bodyParser = require('body-parser'); //

app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); //


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('info.json', 'utf8'));

console.log('Answer: ' + obj['석곽묘']['정의']); //// debugging

app.post('/', function (request, response) {
    console.log('request: \n' + JSON.stringify(request.body));

    var object = request.body.queryResult.parameters['object'];
    var other = request.body.queryResult.parameters['other'];
    var what = request.body.queryResult.parameters['what'];
    var who = request.body.queryResult.parameters['who'];
    var when = request.body.queryResult.parameters['when'];
    var where = request.body.queryResult.parameters['where'];
    var how = request.body.queryResult.parameters['how'];
    var why = request.body.queryResult.parameters['why'];

    let action = (request.body.queryResult.action) ? request.body.queryResult.action: 'default';


    const actionHandlers = {
        'object.how': () => {
            let responseToUser = { fulfillmentText: obj[object][how]};
            sendResponse(responseToUser);
        },

        'object.how.why': () => {
            let responseToUser = { fulfillmentText: obj[object][how][why]};
            sendResponse(responseToUser);
        },
        
        'object.what.how': () => {
            let responseToUser = { fulfillmentText: obj[object][what][how]};
            sendResponse(responseToUser);
        },
       
        'object.what.when': () => {
            let responseToUser = { fulfillmentText: obj[object][what][when]};
            sendResponse(responseToUser);
        },
       
        'object.what.who': () => {
            let responseToUser = { fulfillmentText: obj[object][what][who]};
            sendResponse(responseToUser);
        },
        
        'object.when.how': () => {
            let responseToUser = { fulfillmentText: obj[object][when][how]};
            sendResponse(responseToUser);
        },
        
        'object.where.how': () => {
            let responseToUser = { fulfillmentText: obj[object][where][how]};
            sendResponse(responseToUser);
        },
       
        'other.object.how': () => {
            let responseToUser = { fulfillmentText: obj[other][object][how]};
            sendResponse(responseToUser);
        },
        
        'other.object.what.how': () => {
            let responseToUser = { fulfillmentText: obj[other][object][what][how]};
            sendResponse(responseToUser);
        },
        
        'default': () => {
            let responseToUser = { fulfillmentText: '죄송합니다. 정보가 없는 내용입니다. 다른 궁금한건 없으신가요?' };
            sendResponse(responseToUser);
        }
    };

    if (!actionHandlers[action]) {
         action = 'default';
    }

    actionHandlers[action]();

    function sendResponse(responseToUser) {
        if (typeof responseToUser === 'string') {
            let responseJson = { fulfillmentText: responseToUser };
            response.json(responseJson);
        }
        else {
            let responseJson = {};
            responseJson.fulfillmentText = responseToUser.fulfillmentText;
            if (responseToUser.fulfillmentMessages) {
                responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
            }
            if (responseToUser.outputContexts) {
                responseJson.outputContexts = responseToUser.outputContexts;
            }
            response.json(responseJson);
        }
    }
});
