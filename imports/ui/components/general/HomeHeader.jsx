import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  style: {
    height: 50,
  },
  button: {
    height: 50,
  },
  label: {
    fontSize: '1.2em',
    // padding: '40px',
    height: 50,
    display: 'inline-block',
  },
};

export default class Header extends Component {

  render() {
    return (
      <header className="home-header">
        <div className="table-cell">
          <article className="col-sm-8 col-sm-offset-2">
            <h1 className="secondary">La meilleure hypothèque, Simplement.</h1>
            <h4 className="secondary">
              Mettez tous les prêteurs en compétition et trouvez le
              financement idéal pour votre future propriété.
            </h4>
            <br />
            <RaisedButton
              // className="primary-mui"
              label="Testez votre éligibilité"
              href="/start"
              primary
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
            />
          </article>
        </div>
        <div className="arrow">
          <span className="arrow-adjust fa fa-angle-down fa-3x" />
        </div>
      </header>
    );
  }
}
