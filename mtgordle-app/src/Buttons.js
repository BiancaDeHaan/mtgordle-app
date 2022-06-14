import React, { useState, useEffect } from 'react';
import { SmallPopup } from './Popup.js';
import heart from './images/heart.png';
import stats from './images/stats.png';
import info from './images/info.png';
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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
            <img className="icon" src={stats} alt="stat-img" onClick={showInfoPopup} />
            {isOpen && <SmallPopup
                content={<>
                    <h2 className="popup-title"><b>Statistics</b></h2><div className="popup-text">
                        <StatDisplay />
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

function StatDisplay(props) {
    const [chartData, setChartData] = useState(() => {
        const saved = localStorage.getItem('chart-data')
        const initialValue = JSON.parse(saved);
        return initialValue || [0, 0, 0, 0, 0, 0];
    });

    const[totalGames, setTotalGames] = useState(() => {
        const saved = localStorage.getItem('total-games');
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
    })

    const[totalWins, setTotalWins] = useState(() => {
        const saved = localStorage.getItem('total-wins');
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
    })

    useEffect(() => {
        localStorage.setItem('chart-data', JSON.stringify(chartData));
    }, [chartData]);

    return (
        <div>
        <StatNumbers totalWins={totalWins} totalGames={totalGames} />
        {chartData.every(item => item === 0) 
        ? <p>No data</p> 
        : <StatChart chartData={chartData} /> }
        </div>
    )
}

function StatNumbers(props) {
return(
    <div>
        <div className="stat">
            <p>Games
            Played <br/>
            {props.totalGames}</p>
        </div>
        <div className="stat">
            <p>Games 
            Won <br/>
            {props.totalWins}</p>
        </div>
    </div>
)
}

function StatChart(props) {
    const labels = ['1', '2', '3', '4', '5', '6'];

    var data = {
        labels,
        datasets: [
            {
                data: props.chartData,
                backgroundColor: 'rgba(89, 247, 242, 0.5)',
                minBarLength: 7
            },
        ],
    };

    return (
        <div>
            <Bar
                data={data}
                options={{
                    indexAxis: 'y',
                    plugins: {
                        title: {
                            display: true,
                            text: "Guess Distribution",
                            color: '#fff',
                            font: {
                                size: 16
                            },
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                        legend: {
                            display: false,
                            position: "bottom"
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                precision: 0
                            }                        }
                    }
                }}
            />
        </div>
    );
}

export { StatButton, InfoButton, HeartButton }