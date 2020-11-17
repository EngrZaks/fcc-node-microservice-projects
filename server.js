// server.js
// where your node app starts

// init project
require("dotenv").config();
var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var validate = require("valid-url");
var app = express();
// var port = 3000;
var port = process.env.PORT;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
// app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(cors());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
// app.use("/public", express.static(`${process.cwd()}/public`));

//using body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// http://expressjs.com/en/starter/basic-routing.html

//index page home view
app.get("/", function (req, res) {
   res.sendFile(__dirname + "/views/index.html");
});
//timestamp home view
app.get("/timestamp", function (req, res) {
   res.sendFile(__dirname + "/views/timestamp.html");
});
// request header Parser home view
app.get("/RequestHeaderParser", function (req, res) {
   res.sendFile(__dirname + "/views/RequestHeaderParser.html");
});
//url shortener home view
app.get("/urlshortener", (req, res) => {
   res.sendFile(__dirname + "/views/urlshortener.html");
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

//TIMESTAMP
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

//REQUEST HEADER PARSER parser starts here
app.get("/api/whoami", (req, res) => {
   // console.log(req.headers);
   res.json({
      // value: Object.keys(req),
      ipaddress: req.connection.remoteAddress,
      language: req.headers["accept-language"],
      software: req.headers["user-agent"],
   });
});

//URL SHORTENER
//connecting mongoose
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
//schema
var URLDataSchema = new mongoose.Schema({
   mainUrl: String,
   suffix: String,
   shortUrl: String,
});
//model
var URLData = mongoose.model("URLData", URLDataSchema);
app.post("/api/shorturl/new", (req, res) => {
   const random = Math.floor(Math.random() * 1000);
   const mainUrl = req.body.url;
   const suffix = random.toString();
   var shortUrl = "/api/shorturl/" + suffix;
   if (validate.isUri(mainUrl)) {
      console.log("valid url received");
      var NewData = new URLData({
         mainUrl: mainUrl,
         suffix: suffix,
         shortUrl: shortUrl,
      });
      NewData.save((err, data) => {
         if (err) {
            console.log(err);
         } else {
            console.log(data);
            res.json({
               original_url: data.mainUrl,
               short_url: ":" + data.suffix,
            });
         }
      });
   } else {
      console.log("invalid url");
      res.json({ error: "invalid url" });
   }
});
//get a request with the new shortened url
app.get("/api/shorturl/:newsuffix", (req, res) => {
   let newsuffix = req.params.newsuffix;
   // let newshorturl = "/api/shorturl/" + mews;
   URLData.findOne({ suffix: newsuffix }, (err, data) => {
      if (err) {
         console.log(err);
         res.json(err);
      } else {
         res.redirect(data.mainUrl);
         console.log(data);
         console.log(data.mainUrl);
         // res.redirect(data.mainUrl);
      }
   });
});
// console.log(mongoose.connection.readyState);

// listen for requests :)
var listener = app.listen(port, function () {
   console.log("Your app is listening on port " + listener.address().port);
});
