import { StatButton, InfoButton, HeartButton } from './Buttons.js';

function TopNav(props) {
    return (
      <div className="top-nav">
          <div >
            <InfoButton />
          </div>
          <Title />
          <div >
            <StatButton />
          </div>
      </div>
    )
  }

  function Title(props) {
    return <span><h1 className="title">MTGordle</h1></span>
  }

  export {TopNav}