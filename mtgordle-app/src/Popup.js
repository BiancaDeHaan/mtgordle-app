function SmallPopup(props) {
    return (
    <div className="small-popup-box">
      <div className="small-box">
        <span className="small-close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
    )
  }
  
  function Popup(props) {
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </div>
      </div>
    );
  };

  export {Popup, SmallPopup}