// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Models
var Note = require("./models/Note.js");
var Story = require("./models/Story.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(process.cwd() + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json"}));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Mongoose db configuration
var databaseUri = "mongodb://localhost/mongonews";
    if(process.env.MONGODB_URI){
        mongoose.connect(process.env.MONGODB_URI);
    }else{
        mongoose.connect(databaseUri)
    };

// mongoose.connect("mongodb://localhost/mongonews");
var db = mongoose.connection;

// Show mongoose errors
db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

// Mongoose Db logged in message
db.once("open", function(){
    console.log("Mongoose connection successful!")
});

// App routes
app.get("/", function(req, res){
    var query = Story.find({}).sort({natural: -1}).limit(10);
    query.exec(function(err, docs){
        if(err){
            throw error;
        }
        res.render("index", {story: docs});
    });
});

// Scrape NYT Sports articles
app.get("/scrape", function (req, res){
    request("https://www.nytimes.com/section/sports", function(error, response, html){
        var $ = cherrio.load(html);

        $("article.story").each(function(i, element){
            var result = {};

            result.title = $(this).find("div.story-body").find("h2.headline").find("a").text();
            result.link = $(this).find("a").attr("href");
            result.image = $(this).find("a").find("img").attr("src");
            console.log("result");

            var entry = new Story (result);
            entry.save(function(err, doc){
                if (err) {
                    console.log(err);
                }else{
                    console.log(doc);
                }
            });
        });
    });
    res.redirect("/");

})

// Get articles from db
app.get("/stories", function(req, res){
    // Get every doc from Articles array
    Story.find({}, function(error, doc){

        if (error){
            console.log(error);
        
        }else{
            res.json(doc);
        }
    });

});

// Grab articles by ObjectId
app.get("/stories/:id", function(req, res){
    // using the id, prepare a query to find a match in the db
    Story.findOne({ "_id": req.params.id })
    // populate the notes
    .populate("note")
    // execute the query
    .exec(function(error, doc){
        if(error){
            console.log(error);
        }

        // Send doc as json obect
        else{
            res.json(doc);
        }
    });
});

app.get("/saved", function(req, res){
    Story.find({ saved: true }, function(error, doc){
        if(error){
            console.log(error);
        }

        else{
            res.render("saved", { story: doc});

        }
    });
});

// set false/true
app.post("/updates/:id", function(req, res){
    Story.where({ _id: req.params.id }).update({ $set:{ saved: true }})

    .exec(function(error, doc){
        if (error){
            console.log(error)
        
        }else{

            res.json(doc)
        }
    });
});

// set true/false
app.post("/updates/:id/:saved", function(req, res){

    Story.where({ _id: req.params.id, saved: true })
    .update({ $set: { saved: false}
})
.exec(function(error, doc){
    if(error){
        console.log(error);
    }
    else{
        res.json(doc)
        }
    });
});

// Post the notes
app.post("/notes/:id", function(req, res){
    //create new note and pass req.body
    var newNote = new Note(req.body);
    console.log(newNote)

    // Save the note to the db
    newNote.save(function(error, doc){
        if (error){
            console.log(error);
        }
        else{
            Story.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
            // execute the query
            .exec(function(err, doc){
                if(err){
                    console.log(err)
                }
                else{
                    res.send(doc);
                }
            });
        }
    });
});

// grab articles by ObjectId
app.get("/notes/:id", function(req, res){
    // use teh parameter id to query the db and find a match
    Story.findOne({ "_id": req.params.id })
    // populate the notes 
    .populate("note")
    // execute the query
    .exec(function(error, doc){
        if(error){
            console.log(error)
        }else{
            res.json(doc);
        }
    });
});

app.listen(port, function(){
    console.log("App listening on port " + port);
});