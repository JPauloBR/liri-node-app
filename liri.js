//Keys to access twitter and spotify apis from an external file
var keys = require("./keys.js");

//external package to handle twitter api calls
var Twitter = require('twitter');

////external package to handle spotify api calls
var Spotify = require('node-spotify-api');

//external package to handle omdb api calls
var request = require("request");

//external package to handle files
var fs = require("fs");

var commands = process.argv[2];
var args = [];

//getting 1 or more arguments after the command
for (var i = 3; i < process.argv.length; i++) {
		args += process.argv[i]+ " ";
	};

//Main Program
main(commands, args);

//Main Function
function main(commands, args) {
	switch (commands) {
		case "my-tweets":
		twitter(args);
		break;

		case "spotify-this-song":
		spotify(args);
		break;

		case "movie-this":
		movie(args);
		break;

		case "do-what-it-says":
		doIt();
		break;

		default:
		log("The available commands are: ");
		log( "my-tweets <twitter_id>");
		log( "spotify-this-song <song name>");
		log( "movie-this <movie title>");
		log( "do-what-it-says");
		log( "Please choose a valid command and try again!");
	}
}

function twitter(user){
	var client = new Twitter ({
		consumer_key : keys.twitterKeys.consumer_key,
		consumer_secret : keys.twitterKeys.consumer_secret,
		access_token_key : keys.twitterKeys.access_token_key,
		access_token_secret : keys.twitterKeys.access_token_secret,
	});
	var params = {
		screen_name: user,
		count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (var i = tweets.length - 1; i >= 0; i--) {
	  		log((i+1)+") "+tweets[i].created_at.substring(0,19)+ " "+ tweets[i].text);
	  	}
	  }
	  else log(error);
	});
};

function spotify(song) {
	log("song: "+ song);
	var spotify = new Spotify({
	  id: keys.spotifyKeys.client_id,
	  secret: keys.spotifyKeys.client_secret
	});
	if(song == "") { 
		song = "The Sign";
	}

	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return log('Error occurred: ' + err);
	  };
	  for (var i = 0; i < data.tracks.items.length; i++) {
	  	log("============= "+(i+1)+" ==========================");
	  	log("                                      ");
	  	log("Artist: "+data.tracks.items[i].artists[0].name);
	  	log("Song: "+data.tracks.items[i].name);
	  	if(data.tracks.items[i].preview_url){
	  		log("Preview: "+data.tracks.items[i].preview_url);
	  	};
	  	log("Album: "+data.tracks.items[i].album.name);
	  	log("                                      ");
	  }
	});

};

function movie(movieName) {
	if(movieName == ""){
		movieName = 'Mr. Nobody.';
	}
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		request(queryUrl, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				if(JSON.parse(body).Title){
			  		log("Title: " + JSON.parse(body).Title);
				}
				else log(movieName+ "was not found in the OMDB Database");
			  	if(JSON.parse(body).Year){
			  		log("Year: " + JSON.parse(body).Year);
			  	}
			  	if(JSON.parse(body).Ratings) {
				  	if(JSON.parse(body).Ratings[0]){
				  		log("Ratings: " + JSON.parse(body).Ratings[0].Source + " " + JSON.parse(body).Ratings[0].Value);
				  	}
				  	if(JSON.parse(body).Ratings[1]){
				  		log("Ratings: " + JSON.parse(body).Ratings[1].Source + " " + JSON.parse(body).Ratings[1].Value);
				  	}
				  }
			  	if(JSON.parse(body).Country){
			  		log("Country: " + JSON.parse(body).Country);
			  	}
			  	if(JSON.parse(body).Language){
			  		log("Language: " + JSON.parse(body).Language);
			  	}
			  	if(JSON.parse(body).Plot){
			  		log("Plot: " + JSON.parse(body).Plot);
			  	}
			  	if(JSON.parse(body).Actors){
			  		log("Actors " + JSON.parse(body).Actors);
			  	}
			}
		})
};

function doIt() {
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return log(error);
	  }
	  // Then split it by commas (to make it more readable)
	  	var dataArr = data.split(",");
	  	main(dataArr[0], dataArr[1]);
	});

};

function log(message) {
	console.log(message);
	fs.appendFile("log.txt", message+"\n", function(err) {

	  // If an error was experienced we say it.
	  if (err) {
	    console.log(err);
	  }
	});
}

