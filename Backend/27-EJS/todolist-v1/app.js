//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname +"/date.js");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 

const tasks = ["Play", "Code", "Learn"];
const workTask = [];

app.get("/", function(req, res) {

    const day = date.getDate();
    
    res.render("lists", { 
        listTitle: day,
        newTask: tasks
    });
});

app.post("/", function(req, res) {

    console.log(req.body);
    
    const newTask = req.body.newTask;

    if (req.body.list === "Work") {
        workTask.push(newTask);
        res.redirect("/work");
    } else {
        tasks.push(newTask);
        res.redirect("/");
    }

    
});

app.get("/work", function(req, res) {
    res.render("lists", {
        listTitle: "Work list",
        newTask:  workTask
    });
});

app.post("/work", function(req, res) {
    const newTask = req.body.newTask;
    workTask.push(newTask);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
    
});
