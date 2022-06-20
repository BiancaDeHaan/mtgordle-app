import { Popup } from './Popup.js';
import React, { useState } from 'react';

function CardInfo(props) {
    const [isOpen, setIsOpen] = useState(false);
    function renderInfo(label, text) {
      return (
        <div className="row row-border-reverse">
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
      <div>
        <h2 className="header">Information</h2>
        {renderInfo("Set:", set)}
        {renderInfo("Card type:", type)}
        {renderInfo("CMC:", mana)}
        {renderInfo("Flavor text:", flavor)}
        {renderInfo("Card text:", text)}
        {(props.numGuesses >= 5 || props.gameOver===true)
          ? <div className="row row-border-reverse">
            <div className="image-text" onClick={showImage}><strong>Click to show image</strong></div>
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

  export {CardInfo}