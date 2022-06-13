import React, { useState } from 'react';
import { SmallPopup } from './Popup.js';
import heart from './images/heart.png';
import stats from './images/stats.png';
import info from './images/info.png';

function InfoButton(props) {
    const [isOpen, setIsOpen] = useState(false);
    function showInfoPopup() {
        setIsOpen(true);
    }

    function togglePopup() {
        setIsOpen(!isOpen);
    }

    return (
        <span>
            <img className="icon" src={info} alt="info-img" onClick={showInfoPopup} />
            {isOpen && <SmallPopup
                content={<>
                    <h2 className="popup-title"><b>About</b></h2><div className="popup-text">
                        <p>A respectful homeage to <a className="popup-links-text" href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> and
                            Worlde-like clones, such as <a className="popup-links-text" href="https://www.heardle.app/">Heardle</a></p>
                        <p>Each day, we generate a random Magic the Gathering card. Guess the card, with more hints being provided per guess!</p>
                        <p>Note: Still in development!</p>
                    </div>
                </>}
                handleClose={togglePopup}

            />}
        </span>
    )
}

function StatButton(props) {
    const [isOpen, setIsOpen] = useState(false);
    function showInfoPopup() {
        setIsOpen(true);
    }

    function togglePopup() {
        setIsOpen(!isOpen);
    }

    return (
        <span>
            <img className="icon" src={stats} alt="stat-img" onClick={showInfoPopup}/>
            {isOpen && <SmallPopup
                content={<>
                    <h2 className="popup-title"><b>Stats</b></h2><div className="popup-text">
                        <p>Coming soon!</p>
                    </div>
                </>}
                handleClose={togglePopup}

            />}
        </span>
    )

}

function HeartButton(props) {
    const [isOpen, setIsOpen] = useState(false);
    function showHeartPopup() {
        setIsOpen(true);
    }

    function togglePopup() {
        setIsOpen(!isOpen);
    }

    return (
        <span>
            <img className="icon  " src={heart} alt="heart-img" onClick={showHeartPopup} />
            {isOpen && <SmallPopup
                content={<>
                    <h2 className="popup-title"><b>About</b></h2><div className="popup-text">
                        <p>Hello!</p>
                    </div>
                </>}
                handleClose={togglePopup}

            />}
        </span>
    )
}

export { StatButton, InfoButton, HeartButton }