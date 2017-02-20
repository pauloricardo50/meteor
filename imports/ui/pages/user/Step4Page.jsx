import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  img: {
    width: '100%',
    padding: 40,
  },
  h4: {
    lineHeight: '1.5em',
    textAlign: 'justify',
    padding: 20,
  },
};

export default class Step4Page extends Component {
  componentDidMount() {
    DocHead.setTitle('Étape 4 - e-Potek');
  }

  render() {
    return (
      <div>
        <h1>4ème Étape <small>Le contrat</small></h1>

        <section className="mask1 animated fadeIn">
          <img
            src="/img/step4_icons.svg"
            alt="Envoyez votre dossier à la banque"
            style={styles.img}
          />
          <h4
            className="col-sm-6 col-sm-offset-3"
            style={styles.h4}
          >
            Vous y êtes presque! Si vous estimez que vos informations sont correctes,
            envoyez votre dossier à la banque.
            <br /><br />
            Vous recevrez un contrat dans environ 7
            jours ouvrables, que vous pourrez étudier en toute tranquilité.
          </h4>
          <br />
          <div className="col-xs-12">
            <div className="form-group text-center">
              <RaisedButton label="Envoyer mon dossier" primary />
            </div>
            <div className="form-group text-center">
              <RaisedButton label="Pas encore" href="/step3" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Step4Page.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
