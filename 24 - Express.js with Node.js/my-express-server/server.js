 const express = require('express')
 const bodyParser = require("body-parser");
 const app = express()

 app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.send("<h1>Hello World!</h1>");
})

app.get("/contact", function(req, res){
    res.send("Contact me at: borbruno75@gmail.com");
})

app.get("/about", function(req, res){
    res.send("Kalenjin man from Ndalat who loves programming!");
})

app.get("/hobbies", function(req, res){
    res.send("<ul><li>Code</li><li>Rugby</li><li>Cooking</li></ul>");
})

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
