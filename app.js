const express = require("express");
const https = require("https");
//Look through the body on the post request to fetch the data posted
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Make get request to external server with node
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")

    //res.send("Server is up and running."); //We can only have one send in the whole request
});

app.post("/", function(req, res){

    const query = req.body.cityName;
    const appKey = "8a8d7c6845a2713153ba924f45705698";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid="+ appKey +"&units="+ units;

    https.get(url, function(response){
        console.log(response.statusCode);

        //The response received by the external server
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            //console.log(icon);

            //Send the data we got from the external website to the client
            res.write("<h1>The temperature in " + query + " is "  + temp + " degrees Celcius. </h1>");
            res.write("<h1> The weather is currently "  + weatherDescription + ".</h1>");
            res.write("<img src=" + imageURL + ">")

            res.send()

        });
    });
 
})


app.listen(3000, function(){
    console.log("Server is running on port 3000.")
});