//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB')
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.log('Connection error:', error);
    });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

///////////////////////////////////Request targeting all articles//////////////////////////////////////////////////////////
app.route("/articles")

  // GET all articles
  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find({});
      res.send(foundArticles);
    } catch (err) {
      console.error("Error fetching items:", err);
      res.status(500).send("An error occurred while fetching items.");
    }
  })

  // POST a new article
  .post(async function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    try {
      await newArticle.save();  // Save the new article to the database
      res.send("Successfully saved a new article.");
    } catch (err) {
      console.error("Error saving article:", err);
      res.status(500).send("An error occurred while saving the article.");
    }
  })

  // DELETE all articles
  .delete(async function(req, res) {
    try {
      await Article.deleteMany({});  // Delete all articles from the collection
      res.send("Successfully deleted all articles.");
    } catch (err) {
      console.error("Error deleting articles:", err);
      res.status(500).send("An error occurred while deleting articles.");
    }
  });

///////////////////////////////////Request targeting a specific article//////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

  // GET a specific article by title
  .get(async function(req, res) {
    const requestedTitle = req.params.articleTitle;

    try {
      const foundArticle = await Article.findOne({ title: requestedTitle });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      res.status(500).send("An error occurred while fetching the article.");
    }
  })
  
  // PUT to update a specific article
  .put(async function(req, res) {
    const requestedTitle = req.params.articleTitle;

    try {
      const updatedArticle = await Article.updateOne(
        { title: requestedTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      );
      if (updatedArticle.matchedCount > 0) {
        res.send("Successfully updated the article.");
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      res.status(500).send("An error occurred while updating the article.");
    }
  })
  
  // PATCH to update specific fields of a specific article
  .patch(async function(req, res) {
    const requestedTitle = req.params.articleTitle;

    try {
      const updatedArticle = await Article.updateOne(
        { title: requestedTitle },
        { $set: req.body }
      );
      if (updatedArticle.matchedCount > 0) {
        res.send("Successfully updated the article.");
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      res.status(500).send("An error occurred while updating the article.");
    }
  })
  
  // DELETE a specific article
  .delete(async function(req, res) {
    const requestedTitle = req.params.articleTitle;

    try {
      const deletedArticle = await Article.deleteOne({ title: requestedTitle });
      if (deletedArticle.deletedCount > 0) {
        res.send("Successfully deleted the article.");
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      res.status(500).send("An error occurred while deleting the article.");
    }
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});