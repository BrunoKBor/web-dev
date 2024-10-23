//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB")
    .then(() => {
        console.log("Successfully connected to mongodb");
    })
    .catch((error) => {
        console.log('Connection error:', error);
    });

    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
    
    const User = mongoose.model('User', userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", async function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
      });
  
      try {
        await newUser.save();  
        res.render("secrets");
      } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send("An error occurred while saving the user.");
      }
});

app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        } else {
          res.status(404).send("Email or password is incorrect.");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        res.status(500).send("An error occurred while fetching the article.");
      }
});





app.listen(3000, function() {
    console.log("Server started on port 3000");
  });