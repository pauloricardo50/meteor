import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  text: {
    paddingTop: 250,
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 150,
    display: 'block',
    width: '70%',
  },
};

export default class Header extends Component {

  render() {
    return (
      <header className="home-header">
        {/* <AccountsModalContainer /> */}
        <div className="col-sm-8 col-sm-offset-2" style={styles.text}>
          <h1 className="secondary">La meilleure hypothèque, Simplement.</h1>
          <h4 className="secondary">
            Mettez tous les prêteurs en compétition et trouvez le
            financement idéal pour votre future propriété.
          </h4>
          <br />
          <RaisedButton label="Commencer" href="#start" primary />
        </div>
        {/* <img src="img/multi_house.svg" alt="e-Potek" style={styles.image} className="hidden-xs" /> */}
      </header>
    );
  }
}
