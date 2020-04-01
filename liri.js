require("dotenv").config();
var keys = require("./keys.js");
var Spotify= require ('node-spotify-api');
var request= require ("request");
var moment = require ("moment");
var spotify = new Spotify(keys.spotify);
 var fs = require ("fs");

 var commandArgs= process.argv;

 var userInput= "";

 for (var i=3; i < commandArgs.length; i++) {
     //wheen userinput is more than 1 word
     if ( i >3 && i < commandArgs.length) {
         userInput=userInput +"%20" + commandArgs[i];
         //%20 encode a space similar to +
     } else {
         userInput += commandArgs[i];
     }
     console.log(userInput);
 }

 var userCommand= process.argv[2];
 console.log(userCommand);
 console.log(process.argv)
 
 liristart();

 function liristart (){
     switch (userCommand) {
         case "concert-this":
     }
 };

 var queryURL= "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp" 
 request(queryURL, function (error, response, body){
     if (!error && response.statusCode === 200){
         var data = JSON.parse(body);
         for (var i =0; i <data.length; i++) {
             console.log ("Venue: " + data[i].venue.name);
         }
     }

 });