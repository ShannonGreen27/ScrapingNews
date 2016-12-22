// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require('method-override');
var path = require('path');

// Mongoose mpromise deprecated - use bluebird for promises
var Promise = require("bluebird");

mongoose.Promise = Promise;


//model controllers
var application_controller = require('./controllers/application_controller');
var scrape_controller = require('./controllers/scrape_controller');
var articles_controller = require('./controllers/articles_controller');

// instantiatize express
var app = express();

// Express settings
// ================

// override POST to have DELETE and PUT
app.use(methodOverride('_method'));

// set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(path.join(__dirname, 'public')));

// what to send based on route
app.use('/', application_controller);
app.use('/scrape', scrape_controller);
app.use('/articles', articles_controller);


// Database configuration with mongoose
mongoose.connect("mongodb://heroku_qrhg0vn9:otiqhj8ccdb9j9eoghckl1c7bp@ds133388.mlab.com:33388/heroku_qrhg0vn9");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

// our module get's exported as app.
module.exports = app;