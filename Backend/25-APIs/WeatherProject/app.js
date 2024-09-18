const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname +"/index.html");
})

app.post("/", function(req, res) {
    console.log("Post Received");
    console.log(req.body.cityName);
    const query = req.body.cityName;
    const units = "metric";
    const apiKey = "10a69184b79a3d621b2be7d93aab5a13";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+units+"&appid="+apiKey+""

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description
            const location = weatherData.name
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"

            console.log(location);
            console.log(temp);
            console.log(description);
            console.log(icon);

            res.write(`<h1>The weather in ${location}</h1>`);
            res.write("<h2>Temperature: "+temp+"°C <img src="+imageURL+"></h2>");
            res.send()
            
        })
    })
})

app.listen(port, function() {
    console.log(`App is listening on port ${port}`);
    
})
