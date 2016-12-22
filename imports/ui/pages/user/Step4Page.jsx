import React, {PropTypes} from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';


export default class Step4Page extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 4 - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h1>4ème Étape <small>Enfin, le contrat</small></h1>
        <img
          src="img/step4_icons.svg"
          alt="Votre dossier => Banque"
          style={{
            width: '100%',
            padding: 40,
          }}
        />
        <p
          className="col-sm-6 col-sm-offset-3"
          style={{ textAlign: 'justify', padding: 20 }}
        >
          Vous y êtes presque! Si vous estimez que vos informations sont correctes,
          envoyez votre dossier à la banque. Vous recevrez un contrat dans environ 7
          jours ouvrables, que vous pourrez étudier en toute tranquilité.
        </p><br />
        <div className="col-xs-12">
          <div className="form-group text-center">
            <RaisedButton label="Envoyer mon dossier" primary />
          </div>
          <div className="form-group text-center">
            <RaisedButton label="Pas encore" href="/step3" />
          </div>
        </div>
      </section>
    );
  }
}

Step4Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
