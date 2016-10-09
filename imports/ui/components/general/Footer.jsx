import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="col-sm-4 text-center">
          <p>Contact</p>
        </div>
        <div className="col-sm-4 text-center">
          <p>Copyright (c) 2016</p>
        </div>
        <div className="col-sm-4 text-center">
          <p>Made in Switzerland</p>
        </div>
      </footer>
    );
  }
}
