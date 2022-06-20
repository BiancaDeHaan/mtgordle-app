const path = require('path');
const express = require("express");
//import schedule from 'node-schedule'
var cron = require('node-cron');


const PORT = process.env.PORT || 3001;

const app = express();

// https://api.scryfall.com/cards/random?q=f%3Astandard

var card_name = "Sythis Harvest Hand";

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../mtgordle-app/build')));
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.get("/card", (req, res) => {
  res.json({card_name: {card_name}});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);

  cron.schedule('0 0 * * *', () => {
    console.log('Updating card at 12:00 EST');
    fetch('https://api.scryfall.com/cards/random?q=f%3Astandard') 
    .then(res => res.json()) 
    .then(
      (result) => {
        card_name = result.name;
      }
    );
  }, {
    scheduled: true,
    timezone: "America/New_York"
  }); });
  


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../mtgordle-app/build', 'index.html'));
  });


  /*
  schedule.scheduleJob('0 0 * * *', () => { 
    // run everyday at midnight
    fetch('https://api.scryfall.com/cards/random?q=f%3Astandard') 
      .then(res => res.json()) 
      .then(
        (result) => {
          card_name = result.name;
        }
      )
  }) */


  
 