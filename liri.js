require("dotenv").config();
var keys = require("./keys.js");
var Spotify= require ('node-spotify-api');
var request= require ("request");
var moment = require ("moment");
var spotify = new Spotify(keys.spotify);
 var fs = require ("fs");

 var commandArgs= process.argv;

 var userInput= "";
 var newInput="";

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
 //when pushing to log.txt take out the space 
 for (var i=3; i < commandArgs.length; i++) {
     newInput= userInput.replace(/%20/, " ");
 }

 var userCommand= process.argv[2];
 console.log(userCommand);
 console.log(process.argv)
 
 liristart();

 function liristart (){
     switch (userCommand) {
         case "concert-this":
             fs.appendFileSync("log.txt", newInput + "\n-----\n", function(error){
                 if (error) {
                     console.log(error);
                 };
        
     });


 var queryURL= "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp" 
 request(queryURL, function (error, response, body){
     if (!error && response.statusCode === 200){
         var data = JSON.parse(body);
         for (var i =0; i <data.length; i++) {
             console.log ("Venue: " + data[i].venue.name);
             fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function(err){
                 if (err) {
                     console.log(err);
                 }
             });
             if (data[i].venue.region == "") {
                 console.log("Location: " +data[i].venue.city + " , " +data[i].venue.country);
                 fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function(err){
                    if (err) {
                        console.log(err);
                    }
                });
             } else {
                 console.log("Location: " + data[i].venue.city + ", " +data[i].venue.region +", "
                 + data[i].venue.country + "\n", function (error){
                     if (error) {
                         console.log(error);
                     };
                 });
             }
             // date of show
             var showdate= data[i].datetime;
             showdate = moment(showdate).format("MM/DD/YYYY");
             console.log("Date: " + showdate);
             fs.appendFileSync("log.txt", "Date: " + showdate + "\n----\n", function (eror){
                 if (error) {
                     console.log (error);
                 };
             });

         }
     }

 });
 break;
 //to jumps out of loop into next case
 case "spotify-this-song":
     console.log("here");
     if (!userInput) {
         userInput="The%20Sign";
         newInput= userInput.replace(/%20/g,"");
     }
     fs.appendFileSync("log.txt", newInput + "\n-----\n", function(eror) {
         if (error) {
             console.log(error)
         };
     });
     console.log(spotify);
     spotify.search({
         type: "track",
         query: userInput
        },
         function (err, data) {
             if (err) {
                 console.log ('Error occured: ' + err)
             }  
         var infor= data.tracks.items
         for (var i=0; i < infor.length; i++){
             var albums= infor[i].album;
             var songname=infor[i].name;
             var preview= infor[i].preview_url;
             var artistInfo= albums.artists;
             for (var q=0; q <artistInfo.length; q++){
                 console.log("Artist: " + artistInfo[q].name)
                 console.log("Song title: " + songname)
                 console.log("Preview of the song " + preview)
                 console.log("Album name: " + albums.name)

                 fs.appendFileSync("log.txt", "Artist: " + artistInfo[q].name + "\nSong Name: " + songname + "\nPreview of Song: " + preview + "\nAlbum Name: " + albums.name + "\n----------------\n", function (error) {
                    if (error) {
                        console.log(error);
                    };
             });
         } 
     }

     })
     break;
     case "movie-this":
        if (!userInput) {
            userInput = "The%20Titanic";
            newInput = userInput.replace(/%20/g, " ");
        }
        fs.appendFileSync("log.txt", newInput + "\n-----------\n", function (error) {
            if (error) {
                console.log(error);
            };
        });
        var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
        request(queryURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var info = JSON.parse(body);
                console.log("Title: " + info.Title)
                console.log("Release Year: " + info.Year)
                console.log("OMDB Rating: " + info.Ratings[0].Value)
                console.log("Rating: " + info.Ratings[1].Value)
                console.log("Country: " + info.Country)
                console.log("Language: " + info.Language)
                console.log("Plot: " + info.Plot)
                console.log("Actors: " + info.Actors)
                fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRating: " +
                info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
                function (error) {
                    if (error) {
                        console.log(error);
                    };
                });
        }
    });

    break;
}
}

if (userCommand == "do-what-it-says") {
    var fs=require("fs");
    fs.readFile("random.txt", "utf8", function (error,data){
        if (error) {
            return console.log(error)
        }
        var textArray= data.split(",");
        userCommand=textArray[0];
        userInput=textArray[1];
        newInput=userInput.replace(/%20/, " ");
        liristart();
    });
};