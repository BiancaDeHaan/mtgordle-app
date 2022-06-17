const path = require('path');
const express = require("express");
//import schedule from 'node-schedule'
const schedule = require('node-schedule');


const PORT = process.env.PORT || 3001;

const app = express();

// https://api.scryfall.com/cards/random?q=f%3Astandard

var card_name = "Goblin Grenade";

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

  const job = schedule.scheduleJob('0 0 * * *', function(){
    fetch('https://api.scryfall.com/cards/random?q=f%3Astandard') 
    .then(res => res.json()) 
    .then(
      (result) => {
        card_name = result.name;
      }
    );
});
});

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


  
 