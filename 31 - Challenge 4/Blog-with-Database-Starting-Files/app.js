// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://brunobor19:GPfepKc5tpCK2WaP@cluster0.tfxyp.mongodb.net/blogDB')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.log('Connection error:', error);
  });

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Create the Post model based on the schema
const Post = mongoose.model("Post", postSchema);

// Home route to display all posts
app.get("/", async function (req, res) {
  try {
    const posts = await Post.find();  // Fetch all posts from the database
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      _: _  // Lodash for string manipulation
    });
  } catch (err) {
    console.log("Error retrieving posts:", err);
    res.status(500).send("An error occurred while fetching posts.");
  }
});

// About page
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

// Contact page
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

// Compose page for creating a new post
app.get("/compose", function (req, res) {
  res.render("compose");
});

// Post route to handle new post submission
app.post("/compose", async function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try {
    await post.save();  // Save the post to the database
    res.redirect("/");
  } catch (err) {
    console.log("Error saving post:", err);
    res.status(500).send("An error occurred while saving the post.");
  }
});

// Route to view a specific post
app.get('/posts/:postsName', async (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postsName);  // Normalize the URL param to lowercase using lodash

  try {
    const posts = await Post.find();  // Fetch all posts
    const foundPost = posts.find(post => _.lowerCase(post.title) === requestedTitle);  // Find the post matching the requested title

    if (foundPost) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    } else {
      res.send("No matching post found!");
    }
  } catch (err) {
    console.log("Error retrieving posts:", err);
    res.status(500).send("An error occurred while fetching the post.");
  }
});

// Start the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
