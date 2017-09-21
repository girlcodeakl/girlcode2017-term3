//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var sanitizer = require ('sanitizer');

var database = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
var posts = [];

//let a client GET the list
var sendPostsList = function (request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
var saveNewPost = function (request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  console.log(request.body.author);
  var cleanmessage= sanitizer.escape(request.body.message);
  var cleanauthor = sanitizer.escape(request.body.author);
  if (request.body.image == "" )
  {request.body.image =  "http://diysolarpanelsv.com/images/dog-with-a-heart-clipart-2.png"
  }
  var cleanimage = sanitizer.escape(request.body.image);
  var post= {};
  post.message = cleanmessage;

  post.image = cleanimage;
  post.author = cleanauthor;
  post.time = new Date();
  post.id = Math.round(Math.random() * 10000);
  post.comments = [];
  //add a fake comment to every post
  post.comments.push("Great question!");
  posts.push(post);
  response.send("thanks for your message. Press back to add another");
  var dbPosts = database.collection('posts');
  dbPosts.insert(post);
}
app.post('/posts', saveNewPost);

//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");


//find a post with given id
app.get('/post', function (req, res) {
   var searchId = req.query.id;
   console.log("Searching for post " + searchId);
   var post = posts.find(x => x.id == searchId);
   res.send(post);
 });

//database
var mongodb = require('mongodb');
var uri = 'mongodb://girlcode:cats123@ds111804.mlab.com:11804/girlcode2017-term3';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
