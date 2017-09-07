//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')

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
  var post= {};
  post.message = request.body.message;
  if (request.body.image == "" )
  {request.body.image =  "https://static01.nyt.com/images/2016/08/10/science/10tb-dogsperm01/10tb-dogsperm01-superJumbo.jpg"
  }
  post.image = request.body.image;
  post.author = request.body.author;
  post.time = new Date();
  post.id = Math.round(Math.random() * 10000);
  posts.push(post);
  response.send("thanks for your message. Press back to add another");

  var dbPosts = database.collection('posts');
  dbPosts.insert(post);


}
app.post('/posts', saveNewPost);

//listen for connections on port 3000
app.listen(3000);
console.log("Hi! I am listening at http://localhost:3000");


//find a post with given id
app.get('/post', function (req, res) {
   var searchId = req.query.id;
   console.log("Searching for post " + searchId);
   var post = posts.find(x => x.id == searchId);
   res.send(post);
 }

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
