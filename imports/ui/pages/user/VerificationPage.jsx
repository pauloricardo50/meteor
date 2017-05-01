import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import { isDemo } from '/imports/js/helpers/browserFunctions';

export default class VerificationPage extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    const object = {};
    object['logic.verification.requested'] = true;
    if (isDemo()) {
      object['logic.verification.validated'] = true;
    }

    cleanMethod('updateRequest', object, this.props.loanRequest._id);
  };

  render() {
    let content = null;
    const verification = this.props.loanRequest.logic.verification;

    if (verification.validated === true) {
      content = (
        <div className="text-center animated fadeIn" style={{ margin: '40px 0' }}>
          <h1 className="success">
            Votre dossier est valide! <span className="fa fa-check" />
          </h1>
          <div style={{ marginTop: 40 }}>
            <RaisedButton label="Continuer" primary containerElement={<Link to="/app" />} />
          </div>
        </div>
      );
    } else if (verification.validated === false) {
      content = (
        <div className="text-center animated fadeIn" style={{ margin: '40px 0' }}>
          <h1 className="warning">
            Il y a eu un petit souci <span className="fa fa-times" />
          </h1>
          <div className="description">
            <p>
              Votre expert a vérifié votre dossier, et y a trouvé une faille. Veuillez addresser les points ci-dessous puis demander une re-vérification.
              <br /><br />
              N'hésitez pas à appeler votre expert en cas de doute.
            </p>
          </div>
          <ul style={{ margin: '20px 0' }}>
            {verification.comments.length > 0 &&
              verification.comments.map((comment, i) => <li key={i}>{comment}</li>)}
          </ul>
          <div style={{ marginTop: 40 }}>
            <RaisedButton label="Re-Vérifier" primary onTouchTap={this.handleClick} />
          </div>
        </div>
      );
    } else {
      content = (
        <article>
          <div className="description">
            <p>
              Votre dossier va être analysé en détail par les professionels d'e-Potek, et votre conseiller vous aidera pour préparer la meilleure demande possible.
            </p>
          </div>
          {verification.requested
            ? <div style={{ height: 150 }} className="animated fadeIn">
              <LoadingComponent />
            </div>
            : <div className="text-center" style={{ margin: '40px 0' }}>
              <RaisedButton label="Envoyer mon dossier" primary onTouchTap={this.handleClick} />
            </div>}
        </article>
      );
    }

    return (
      <section className="mask1">
        <h1>Faites la vérification</h1>

        {content}
      </section>
    );
  }
}

VerificationPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
