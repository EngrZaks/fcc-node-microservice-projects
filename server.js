// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
// var port = 3000;
var port = process.env.PORT;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
   res.sendFile(__dirname + "/views/index.html");
});
app.get("/timestamp", function (req, res) {
   res.sendFile(__dirname + "/views/timestamp.html");
});
app.get("/RequestHeaderParser", function (req, res) {
   res.sendFile(__dirname + "/views/RequestHeaderParser.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
   res.json({
      greeting: "hello everyone",
      Intro:
         "I am Abdullahi Zakariyya and this is my first Backend project with NodeJS",
   });
});
// let responseObject = {}
// app.get('/api/timestamp:input', (req, res)=>{
//   var input = req.params.input
//   if(input.includes('-')){
//     responseObject['unix'] = new Date(input).getTime()
//     responseObject['utc'] = new Date(input).toUTCString()

//   }
//   res.json(responseObject)
// })
app.get("/api/timestamp/", (req, res) => {
   res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/timestamp/:date_string", (req, res) => {
   let dateString = req.params.date_string;

   //A 4 digit number is a valid ISO-8601 for the beginning of that year
   //5 digits or more must be a unix time, until we reach a year 10,000 problem
   if (/\d{5,}/.test(dateString)) {
      let dateInt = parseInt(dateString);
      //Date regards numbers as unix timestamps, strings are processed differently
      res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
   }

   let dateObject = new Date(dateString);

   if (dateObject.toString() === "Invalid Date") {
      res.json({ error: "Invalid Date" });
   } else {
      res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
   }
});

// listen for requests :)
var listener = app.listen(port, function () {
   console.log("Your app is listening on port " + listener.address().port);
});
