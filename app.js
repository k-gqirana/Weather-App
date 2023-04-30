require("dotenv").config();

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// This will be used to request data from the openweather api to send back to the client (web page)
const https = require("https"); // native node module hence we don't need to install

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";

  https.get(url, function (response) {
    console.log(response);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data); // This will turn the data recievd from the external server into JSON (since we get a hexadecimal response)
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(
        "<h1>The temperature in " +
          query +
          " is : " +
          temp +
          " degrees Celcuis</h1>"
      );
      res.write(
        "<h3>The weather is currently : " + weatherDescription + "</h3>"
      );
      res.write("<img src =" + imageURL + ">");
      res.send();
      //   console.log(weatherData);
    });
  });
});

app.listen(3000, function () {
  console.log("Server is runing on port 3000");
});
