import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import { isDemo } from '/imports/js/helpers/browserFunctions';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton.jsx';

export default class VerificationPage extends Component {
  handleClick = () => {
    if (isDemo()) {
      const object = {};
      object['logic.verification.validated'] = true;
      cleanMethod('updateRequest', object, this.props.loanRequest._id);
    } else {
      cleanMethod('requestVerification', null, this.props.loanRequest._id);
    }
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
          <p className="description">
            Les informations que vous nous avez confiées nous ont permis de vérifier l'intégrité et la qualité de votre demande de prêt.
          </p>
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
          <ul style={{ margin: '20px 0' }} className="verification-comment-list">
            {verification.comments.length > 0 &&
              verification.comments
                .map((comment, i) => <li key={i}><h3>{i + 1}. {comment}</h3></li>)
                .reduce((prev, curr) => [prev, <hr />, curr])}
          </ul>
          {verification.requested
            ? <div style={{ height: 150 }} className="animated fadeIn">
              <LoadingComponent />
            </div>
            : <div style={{ marginTop: 40 }}>
              <ConfirmButton label="Re-Vérifier" primary handleClick={this.handleClick} />
            </div>}
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
              <ConfirmButton
                label="Envoyer mon dossier"
                primary
                handleClick={this.handleClick}
                text="Vous ne pourrez plus modifier vos informations et vos documents"
              />
            </div>}
        </article>
      );
    }

    return (
      <ProcessPage {...this.props} stepNb={1} id="verification" showBottom={false}>
        <section className="mask1">
          <h1>Faites la vérification</h1>

          {content}
        </section>
      </ProcessPage>
    );
  }
}

VerificationPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
