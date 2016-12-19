var express = require('express');
var router  = express.Router();
var models = require('../models');

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, result) {
    // Log any errors
    if (error) {
      console.log(error);
    } else {
      res.render('articles/index', {
        // result is passed to handlebars to be sent to the page
        result: result
      });   
    }
  });
});


// Create a new comment or replace an existing comment
app.post("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // And save the new comment to the db
  newComment.save(function(error, result) {
    // Log any errors
    if (error) {
      console.log(error);
    } else {
      // Use the article id to find and update it's comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": result.comment })
      // Execute the above query
      .exec(function(err, res) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          res.render('articles/index', {
          // res is passed to handlebars to be sent to the page
          result: res
          }); 
        }
      });
    }
  });
});

module.exports = router;



