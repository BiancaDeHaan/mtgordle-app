import './App.css';
import './Popup.css';
import React, { useState, useEffect } from 'react';
import { Game } from './Game.js';
import { TopNav } from './TopNav.js';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [correctCardInfo, setCorrectCardInfo] = useState([]);
  //var correctCard = "Counterspell";
  const [correctCard, setCorrectCard] = useState("");

  // Fetching the correct card from the server
  useEffect(() => {
    async function fetchData() {
      let data = await fetch("/card");
      data = await data.json();

      const cardName = data.card_name.card_name;
      setCorrectCard(cardName);
      fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            const cardInfo = [result.set_name, result.type_line, result.mana_cost,
            result.flavor_text, result.oracle_text, result.image_uris.art_crop]
            setCorrectCardInfo(cardInfo);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
    fetchData();
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <TopNav />
        <Game correctCard={correctCard} cardInfo={correctCardInfo} />
      </div>
    );
  }
}

export default App;
