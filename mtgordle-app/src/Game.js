import Select from 'react-select'
import { useRef } from 'react';
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from 'react';
import { SmallPopup } from './Popup.js';
import {CardInfo } from './CardInfo.js';
import {CurrentGuesses} from './CurrentGuesses.js';


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
      var resetTime = localStorage.getItem('time-reset');
      localStorage.removeItem('reset-time');

      if (resetTime === null) {
        // If they've never visited the site before
        resetLocalStorage();
        now.setUTCHours(28, 0, 0, 0);
        localStorage.setItem('time-reset', now)
      } else {
        if (Date.parse(now) > Date.parse(resetTime)) {
          resetLocalStorage();
          now.setUTCHours(28, 0, 0, 0);
          localStorage.setItem('time-reset', now);

          setNumOfGuesses(0);
          setGuesses([]);
          setGameOver(false);
          setGameWin(false);
        }
      }

      function resetLocalStorage() {
        localStorage.setItem('guesses', null);
        localStorage.setItem('game-win', false);
        localStorage.setItem('game-over', false);
        localStorage.setItem('num-guesses', 0);
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
      var initialValue = JSON.parse(localStorage.getItem('total-games'));
      if (initialValue === null)
        initialValue = 0;
      localStorage.setItem('total-games', JSON.stringify(initialValue + 1));
    }
  
    function updateTotalWins() {
      var initialValue = JSON.parse(localStorage.getItem('total-wins'));
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
        <div className="content">
          <CardInfo cardInfo={props.cardInfo} numGuesses={numOfGuesses} gameOver={gameOver} correctCard={props.correctCard}/>
          <CurrentGuesses guesses={guesses} />
        </div>
        {gameOver && isPopupOpen && !gameWin && <SmallPopup
          content={<>
            <b className="popup-title">Better luck next time!</b>
            <p className="popup-text">The correct answer was {props.correctCard}!</p>
          </>}
          handleClose={togglePopup}
        />}
        {gameOver && isPopupOpen && gameWin && <SmallPopup
          content={<>
            <b className="popup-title">Awesome job!</b>
            <p className="popup-text">The correct answer was {props.correctCard}!</p>
          </>}
          handleClose={togglePopup}
        />}
      </div>
    );
  }

  export {Game}