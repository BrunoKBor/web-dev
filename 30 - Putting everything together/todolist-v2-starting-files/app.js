//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://brunobor19:GPfepKc5tpCK2WaP@cluster0.tfxyp.mongodb.net/todolistDB')
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.log('Connection error:', error);
    });

// Define a schema for the 'Items' collection
const itemsSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

// Create a model for the Items collection
const Item = mongoose.model('Item', itemsSchema);

const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]  
});


const List = mongoose.model('List', listsSchema);

// Default items to be inserted
const itemsArray = [
  new Item({ name: 'Welcome to your todo list' }),
  new Item({ name: 'Hit the + button to add a new item' }),
  new Item({ name: '<--Check box to delete' })
];

// Insert default items if the collection is empty
async function insertArrays() {
    try {
        const count = await Item.countDocuments({});
        if (count === 0) {
            await Item.insertMany(itemsArray);
            console.log('Items saved to itemsDB:', itemsArray);
        }
    } catch (err) {
        console.error('Error saving data:', err);
    }
}

insertArrays();

app.get("/", async function (req, res) {
    try {
        const items = await Item.find({});
        res.render("list", { listTitle: "Today", newListItems: items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("An error occurred while fetching items.");
    }
});

app.post("/", async function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list; 

  const newItem = new Item({
      name: itemName
  });

  try {
      if (listName === "Today") {
          await newItem.save();
          res.redirect("/");
      } else {
          const foundList = await List.findOne({ name: listName });
          foundList.items.push(newItem); // Add the new item to the custom list
          await foundList.save(); // Save the updated list
          res.redirect("/" + listName); // Redirect to the custom list
      }
  } catch (err) {
      console.error("Error adding item:", err);
      res.status(500).send("An error occurred while adding the item.");
  }
});

// POST request to handle deletion of checked items
app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.itemId; // Item ID from the checkbox
  const listName = req.body.listName; // List name from the hidden input

  try {
      if (listName === "Today") {
          // If item is from the default list (Today), remove it from Item collection
          await Item.findByIdAndDelete(checkedItemId);
          res.redirect("/");
      } else {
          // If item is from a custom list, find the list and remove the item from its items array
          await List.findOneAndUpdate(
              { name: listName }, // Find the list by name
              { $pull: { items: { _id: checkedItemId } } } // Remove the item from the list's items array
          );
          res.redirect("/" + listName); // Redirect back to the custom list
      }
  } catch (err) {
      console.error("Error deleting item:", err);
      res.status(500).send("An error occurred while deleting the item.");
  }
});

// Handle custom lists
app.get("/:customList", async function(req, res) {
  const customListName = _.capitalize(req.params.customList);

  try {
    // Check if the custom list already exists
    const foundList = await List.findOne({ name: customListName });

    if (!foundList) {
      // If the list does not exist, create a new one with default items
      const list = new List({
        name: customListName,
        items: itemsArray  // Use the array of `Item` documents
      });

      await list.save();  // Save the new list
      res.redirect("/" + customListName);  // Redirect to the new list page
    } else {
      // If the list exists, render it
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } catch (err) {
    console.error("Error fetching or creating custom list:", err);
    res.status(500).send("An error occurred while fetching or creating the list.");
  }
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
