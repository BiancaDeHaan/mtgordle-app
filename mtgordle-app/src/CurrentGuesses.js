function CurrentGuesses(props) {
    function renderRow(previousGuess) {
  
      return (
        <div className="row row-guesses">
            {previousGuess===undefined ? 
            <div className="text"> </div> :
            <div className="text">{previousGuess}</div>}
        </div>
      )
    }
  
    return (
      <div>
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

  export {CurrentGuesses}