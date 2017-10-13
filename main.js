"use strict";

//
//https://api.twitch.tv/kraken/channels/therealhellcat?client_id=xiujxr8qj65oeu2nwmyjs4ltpb6kqm
//

const Alexa = require('alexa-sdk');
var https = require('https');
var clientID = 'xiujxr8qj65oeu2nwmyjs4ltpb6kqm';

Alexa.appId = 'amzn1.ask.skill.b20c6a98-8182-4a3a-bb8f-285170d61e0a';

var handlers = {
    "HalloIntent": function() {
         var name = this.event.request.intent.slots.Name.value;

         this.emit(':tell', 'Hi ' + name  );

    },

    "StreamIntent": function () {

       console.log('---- Debug Log ----  Stream Intent läuft');

    var responseString = '',
    speechOutput= '',
    datas,
    reprompt = 'noch jemand ?',
    mythis = this,
    channelID = this.event.request.intent.slots.StreamID.resolutions.resolutionsPerAuthority[0].values[0].value.id;

    console.log('---- Debug Log ---- suche läuft nach ' + channelID);

    if (channelID === undefined) {
        speechOutput = 'Sorry, Ich kenne diesen Streamer noch nicht';
    }

    https.get('https://api.twitch.tv/kraken/streams/' + channelID + '?client_id=' + clientID , (res) => {

       console.log('---- Debug Log ----Api call an '+'https://api.twitch.tv/kraken/streams/' + channelID + '?client_id=' + clientID);

      res.on('data', (d) => {
        datas += d;
        if (d === undefined){
            speechOutput = 'ich kann keine Daten von ' + channelID + 'bekommen';
        }
      });

      res.on('end', function(res) {
        const object = datas;
        var json = JSON.parse(object);
       if (json.stream === null) {
          speechOutput = channelID + ' ist momentan Offline';
       }else {
           speechOutput = channelID + ' streamt ' + json.stream.game + '. Heute mit dem Titel: ' + json.stream.channel.status;
       }

      });

    }).on('error', (e) => {
      console.error(e);
    });
    this.emit(':ask', speechOutput, reprompt);
  },
    "LaunchRequest": function () {
    var speechOutput = "Stream Agent gestartet";
    var reprompt = "frag mich zu einem Streamer";
    this.emit(':ask', speechOutput, reprompt);
  },

    "AMAZON.HelpIntent": function () {
    var speechOutput = "Hallo, Ich sag dir ob Streamer live auf Twitch sind, frage zum Beispiel, ist therealHellcat live ? ";
    var reprompt = "was soll ich tun?";
    this.emit(':ask', speechOutput, reprompt);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = "OK";
    this.emit(':tell', speechOutput );
    },
    "AMAZON.CancelIntent": function () {
        var speechOutput = "auf wieder hören";
    this.emit(':tell', speechOutput );
   }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
