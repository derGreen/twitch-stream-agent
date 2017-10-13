"use strict";

/*/
//https://api.twitch.tv/kraken/channels/therealhellcat?client_id=xiujxr8qj65oeu2nwmyjs4ltpb6kqm
/*/

const Alexa = require('alexa-sdk');
var https = require('https');
var channelID = 'gronkh', clientID = 'xiujxr8qj65oeu2nwmyjs4ltpb6kqm';

var handlers = {

    "HellCatIntent": function () {

        var responseString = '', mythis = this, HellcatID = 'therealhellcat';

        https.get('https://api.twitch.tv/kraken/streams/' + HellcatID + '?client_id=' + clientID, (res) => {

            res.on('data', (d) => {
                responseString += d;
            });

            res.on('end', function (res) {
                const speechOutput = responseString;
                var json = JSON.parse(speechOutput);
                if (json.stream === null) {
                    mythis.emit(':tell', 'leider streamt er gerade nicht');
                } else {
                    mythis.emit(':tell', 'Ja, er ist live und streamt ' + json.stream.game + '. Mit dem Motto ' + json.stream.channel.status);
                }

            });

        }).on('error', (e) => {
            console.error(e);
        });

    },
    "NowIntent": function () {

        var responseString = '', mythis = this;

        https.get('https://api.twitch.tv/kraken/streams/' + channelID + '?client_id=' + clientID, (res) => {

            res.on('data', (d) => {
                responseString += d;
            });

            res.on('end', function (res) {
                const speechOutput = responseString;
                var json = JSON.parse(speechOutput);
                if (json.stream === null) {
                    mythis.emit(':tell', channelID + ' ist Offline');
                } else {
                    mythis.emit(':tell', channelID + ' streamt ' + json.stream.game + '. Heute mit dem Titel: ' + json.stream.channel.status);
                }

            });

        }).on('error', (e) => {
            console.error(e);
        });

    },
    "LaunchRequest": function () {
        var speechOutput = "Stream Agent im dienst! Ich überwache aktuell " + channelID + " und Hell Cat";
        var reprompt = "was soll ich tun?";
        this.emit(':ask', speechOutput, reprompt);
    },

    "AMAZON.HelpIntent": function () {
        var speechOutput = "Ich sag dir ob Hell Cat live ist, frag einfach: ist Helcat online ? ";
        var reprompt = "was soll ich tun?";
        this.emit(':ask', speechOutput, reprompt);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = "OK";
        this.emit(':tell', speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        var speechOutput = "Alle Maschinen stop!";
        this.emit(':tell', speechOutput);
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
