//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get("/", function(req, res) {

    var today = new Date();
    var day = "";

    switch (today.getDay()) {  // Use getDay() 
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;    
        default:
            console.log("Error: current day is " + today.getDay());
            break;
    }

    // Get the date, month, and year
    var currentDate = today.getDate();
    var currentMonth = today.getMonth() + 1;  // Add 1 because months are 0-based
    var currentYear = today.getFullYear();

    // Format the full date string
    var fullDate = day + ", " + currentDate + "/" + currentMonth + "/" + currentYear;


    res.render("lists", { kindOfDay: fullDate});
});

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});
