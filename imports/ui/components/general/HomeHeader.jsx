import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  header: {
    position: 'relative',
    height: '80%',
  },
  text: {
    paddingTop: 100,
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 150,
    display: 'block',
    width: '70%',
  },
  arrowDown: {
    position: 'absolute',
    left: '50%',
    bottom: -100,
  },
  arrowDownAdjustment: {
    position: 'relative',
    left: '-50%',
  },
  h1: {
    fontSize: '4em',
  },
};

export default class Header extends Component {

  render() {
    return (
      <header className="home-header" style={styles.header}>
        {/* <AccountsModalContainer /> */}
        <div className="col-sm-8 col-sm-offset-2" style={styles.text}>
          <h1 className="secondary" style={styles.h1}>La meilleure hypothèque, Simplement.</h1>
          <h4 className="secondary">
            Mettez tous les prêteurs en compétition et trouvez le
            financement idéal pour votre future propriété.
          </h4>
          <br />
          <RaisedButton label="Testez votre éligibilité" href="/start" primary />
          <div style={styles.arrowDown}>
            <span className="fa fa-angle-down fa-3x" style={styles.arrowDownAdjustment}/>
          </div>
        </div>
      </header>
    );
  }
}
