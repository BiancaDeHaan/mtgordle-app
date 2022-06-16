import './App.css';
import './Popup.css';
import { Popup, SmallPopup } from './Popup.js';
import { StatButton, InfoButton, HeartButton } from './Buttons.js';
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import { useRef } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [correctCardInfo, setCorrectCardInfo] = useState([]);
  //var correctCard = "Counterspell";
  const [correctCard, setCorrectCard] = useState("");

  useEffect(() => {
    async function fetchData() {
      let data = await fetch("/card");
       data = await data.json();

       const cardName = data.card_name.card_name;
       // Interestingly, this doesn't take effect until after the useEffect()
       setCorrectCard(cardName); 
       /*
      console.log(correctCard);
      console.log(cardName);
      */
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

function Game(props) {
  // Stored state
  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem('guesses')
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [gameOver, setGameOver] = useState(
    localStorage.getItem('game-over') === 'true'
  );
  const [gameWin, setGameWin] = useState(
    localStorage.getItem('game-win') === 'true'
  );
  const [numOfGuesses, setNumOfGuesses] = useState(() => {
    const saved = localStorage.getItem('num-guesses')
    const initialValue = JSON.parse(saved);
    return initialValue || 0;
  });

  // State
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // State related to search-bar
  const [items, setItems] = useState([]);
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const searchInput = useRef(null);

  // Updating local storage for state changes
  useEffect(() => {
    localStorage.setItem('num-guesses', numOfGuesses);
  }, [numOfGuesses]);

  useEffect(() => {
    localStorage.setItem('game-win', gameWin);
  }, [gameWin]);

  useEffect(() => {
    localStorage.setItem('game-over', gameOver);
  }, [gameOver]);

  useEffect(() => {
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    var now = new Date();
    var resetTime = localStorage.getItem('reset-time');
    console.log(Date.parse(now) > Date.parse(resetTime));
    if (resetTime === null) {
      // If they've never visited the site before
      now.setUTCHours(28, 0, 0, 0);
      localStorage.setItem('reset-time', now)
    } else {
      if (Date.parse(now) > Date.parse(resetTime)) {
        localStorage.removeItem('guesses');
        localStorage.setItem('guesses', []);
        localStorage.removeItem('game-win');
        localStorage.setItem('game-win', false);
        localStorage.removeItem('game-over');
        localStorage.setItem('game-over', false);
        localStorage.removeItem('num-guesses');
        localStorage.setItem('num-guesses', 0);
        now.setUTCHours(28, 0, 0, 0);
        localStorage.setItem('reset-time', JSON.stringify(now));
      }
    }

  }, []);

  // When the submit button is clicked
  async function handleSubmit() {
    if (gameOver)
      return;
    var err = null;
    var results = null;

    if (selectedValue !== undefined && selectedValue !== "" && selectedValue != null) {
      console.log("test");
      results = selectedValue;
    }
    else if (searchValue !== "") {
      await fetch(`https://api.scryfall.com/cards/named?exact=${searchValue.replaceAll(' ', '+')}`)
        .then(res => res.json())
        .then(
          (result) => {
            results = result;
          },
          (error) => {
            err = error;
          }
        )
    }

    // Check if the value is a valid card name
    if (!results || !results.name) { // Invalid card name
      setValue("");
      setItems([]);
      setSelectedValue(null);

      // Create toast to notify user
      toast('Invalid card name was submitted', {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else { // Valid card name
      // Update search bar values
      setValue("");
      setItems([]);
      setSelectedValue(null);

      // Update visuals
      const finalArray = [...guesses, results.name]
      if (finalArray.length >= 6) {
        loseGame();
      }

      // Update state and cookies
      setGuesses(finalArray);
      setNumOfGuesses(finalArray.length);
      //localStorage.setItem('guesses', )

      // Check win condition
      if (results.name === props.correctCard) {
        winGame();
      }
    }
  };

  function loseGame() {
    setGameOver(true);
    setIsPopupOpen(true);
    // Updating statistics
    updateTotalGames();

  }

  function winGame() {
    setGameWin(true);
    setGameOver(true);
    setIsPopupOpen(true);
    updateTotalGames();
    updateTotalWins();
    updateStats();
  }

  function updateTotalGames() {
    var initialValue = localStorage.getItem('total-games');
    if (initialValue === null)
      initialValue = 0;
    localStorage.setItem('total-games', JSON.stringify(initialValue + 1));
  }

  function updateTotalWins() {
    var initialValue = localStorage.getItem('total-wins');
    if (initialValue === null)
      initialValue = 0;
    localStorage.setItem('total-wins', JSON.stringify(initialValue + 1));
  }

  function updateStats() {
    var initialValue = JSON.parse(localStorage.getItem('chart-data'));
    if (initialValue === null)
      initialValue = [0, 0, 0, 0, 0, 0];
    initialValue[numOfGuesses] = initialValue[numOfGuesses] + 1;
    localStorage.setItem('chart-data', JSON.stringify(initialValue));
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }

  // Handle input change event
  function handleInputChange(value, action) {
    if (action.action !== "input-blur" && action.action !== "menu-close") {
      setValue(value);
      setSearchValue(value);
    } else
      return;

    if (inputValue === "")
      return;

    fetch(`https://api.scryfall.com/cards/search?order=name&q=${inputValue}`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  // handle selection
  const handleChange = value => {
    setSelectedValue(value);
    setSearchValue(value.name);
    searchInput.current.blur();
  }

  function handleClick() {
    if (selectedValue && selectedValue.name)
      setValue(selectedValue.name);
    setSelectedValue("");
  }

  return (
    <div className="App">
      <hr />
      <div >
        <ToastContainer />
        <Select className="search-area"
          value={selectedValue}
          getOptionLabel={items => { return items.name; }}
          getOptionValue={items => { return items.id; }}
          onInputChange={handleInputChange.bind(this)}
          onChange={handleChange}
          options={items}
          onFocus={handleClick}
          isDisabled={gameOver}
          ref={searchInput}
          inputValue={inputValue}
          noOptionsMessage={() => 'Searching...'}
          loadingMessage={() => 'Loading...'}
        />
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
      <div>
      <div className="card-info">
        <CardInfo cardInfo={props.cardInfo} numGuesses={numOfGuesses} gameOver={gameOver} correctCard={props.correctCard}/>
      </div>
      <div className="current-guesses">
        <CurrentGuesses guesses={guesses} />
      </div>
      </div>
      {gameOver && isPopupOpen && !gameWin && <SmallPopup
        content={<>
          <b className="popup-title">Better luck next time!</b>
          <p className="popup-text">The correct answer was {props.correctCard}</p>
        </>}
        handleClose={togglePopup}
      />}
      {gameOver && isPopupOpen && gameWin && <SmallPopup
        content={<>
          <b className="popup-title">Awesome job!</b>
          <p className="popup-text">The correct answer was {props.correctCard}</p>
        </>}
        handleClose={togglePopup}
      />}
    </div>
  );
}


function TopNav(props) {
  return (
    <div className="top-nav">
      <header>
        <div className="icon-group-left">
          {//<HeartButton />
          }
          <InfoButton />
        </div>

        <Title />
        <div className="icon-group-right">
          <StatButton />
        </div>
      </header>
    </div>
  )
}

function Title(props) {
  return <h1 className="title">MTGordle</h1>
}


function CardInfo(props) {
  const [isOpen, setIsOpen] = useState(false);
  function renderInfo(label, text) {
    return (
      <div className="row">
        <div className="text"><strong>{label}</strong>{" " + text}</div>
      </div>
    )
  }


  function showImage() {
    setIsOpen(true);
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  let set = "";
  if ((props.numGuesses >= 0 || props.gameOver===true) && props.cardInfo && props.cardInfo[0]) {
    set = props.cardInfo[0];
  }

  let type = "";
  if ((props.numGuesses >= 1 || props.gameOver===true)&& props.cardInfo && props.cardInfo[1])
    type = props.cardInfo[1];

  let mana = "";
  if ((props.numGuesses >= 2 || props.gameOver===true) && props.cardInfo && props.cardInfo[2])
    mana = props.cardInfo[2];
  else if(props.numGuesses >=2  || props.gameOver===true)
    mana = "N/A";

  let flavor = "";
  if ((props.numGuesses >= 3 || props.gameOver===true) && props.cardInfo && props.cardInfo[3])
    flavor = props.cardInfo[3];
  else if(props.numGuesses >=3 || props.gameOver===true)
    flavor = "N/A";

  let text = "";
  if ((props.numGuesses >= 4 || props.gameOver===true) && props.cardInfo && props.cardInfo[4])
    text = props.cardInfo[4].replaceAll(props.correctCard, "[redacted]");

  let image = "";
  if ((props.numGuesses >= 5 || props.gameOver===true) && props.cardInfo && props.cardInfo[5]) {
    image = props.cardInfo[5];
  }
  return (
    <div className="table">
      <h2 className="header">Information</h2>
      {renderInfo("Set:", set)}
      {renderInfo("Card type:", type)}
      {renderInfo("CMC:", mana)}
      {renderInfo("Flavor text:", flavor)}
      {renderInfo("Card text:", text)}
      {(props.numGuesses >= 5 || props.gameOver===true)
        ? <div className="row">
          <div className="image-text" onClick={showImage}>Show image</div>
          {isOpen && <Popup
            content={<>
              <img src={image} alt="MTG card"></img>
            </>}
            handleClose={togglePopup}
          />}
        </div>
        : <div>{renderInfo("Image:", "")}</div>
      }
    </div>
  )
}

function CurrentGuesses(props) {
  function renderRow(previousGuess) {

    return (
      <div className="row row-guesses">
        <div className="text">{previousGuess}</div>
      </div>
    )
  }

  return (
    <div className="table">
      <h2 className="header">Guesses</h2>
      {renderRow(props.guesses[0])}
      {renderRow(props.guesses[1])}
      {renderRow(props.guesses[2])}
      {renderRow(props.guesses[3])}
      {renderRow(props.guesses[4])}
      {renderRow(props.guesses[5])}
    </div>
  )
}



export default App;
