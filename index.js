const express = require("express");
// const axios = require("axios");
const fetch = require("node-fetch");
const ejs = require("ejs");
require("dotenv").config();
const app = express();
const port = 3001;
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
var backgroundsList = [
  "day1.jpg",
  "day2.jpg",
  "day3.jpg",
  "day4.jpg",
  "day5.jpg",
  "night1.jpg",
  "night2.jpg",
  "night3.jpg",
  "night4.jpg",
  "night5.jpg",
  "cloudy1.jpg",
  "cloudy2.jpg",
  "cloudy3.jpg",
  "cloudy4.jpg",
  "cloudy5.jpg",
  "rainy1.jpg",
  "rainy2.jpg",
  "rainy3.jpg",
  "rainy4.jpg",
  "rainy5.jpg",
];
app.get("/", (req, res) => {  
  let locDate = { temp: "Temp", disc: "Discription", location: "Location", humidity: "Humidity ", feel: "Feel ", speed: "Speed" };
  var randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)];
  res.render("index.ejs",{
    background:randomBackground,
    locDate: locDate,
  });
});

app.post("/", async (req, res) => {
  try {
      var randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)];
      const location = await req.body.city;
      const lang = await req.body.lang;
      const units = await req.body.units;

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=${units}&lang=${lang}`;
      let response = await fetch(url);
      let data = await response.json();
      console.log(data);
      let locDate = {};
      let unit;
      if(units=="metric") {
          unit="°C";
      }
      else if(units=="standard"){
        unit="K";
      }
      else {
        unit="°F";
      }
      locDate.unit = unit;
      locDate.temp = Math.floor(data.main.temp);
      locDate.disc = data.weather[0].description;
      locDate.feel = data.main.feels_like;
      locDate.humidity = data.main.humidity;
      locDate.speed = data.wind.speed;
      locDate.location = location;
      //console.log(locDate);
      res.render("index", { locDate: locDate,background:randomBackground,});
  } catch (err) {
      console.log(err);
      res.status(400).json({ data: 'not found!' })
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});