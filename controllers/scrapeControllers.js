// Dependencies
var express = require ("express");

var router = express.Router();

// export the app
module.exports(function(app){
    app.get("/stories", function(req, res){
        var query = Story.find({})

        query.exec(function(err, docs){
            if (err){
                throw err;
            }
            res.render("index", {story: docs});
        });
    });
}