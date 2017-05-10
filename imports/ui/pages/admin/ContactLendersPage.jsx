import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fileSaver from 'file-saver';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { base64ToBlob } from '/imports/js/helpers/base64-to-blob.js';

import RaisedButton from 'material-ui/RaisedButton';

// choisit un prêteur dans la liste
// e-potek voit "Prêteur a été choisi" -> "connecter avec preteur"
// envoyer un mail/appeler le preteur et demander sa confirmation
// de quelles infos as-tu besoin pour cet email ou pour cet appel?
// retour du preteur en combien de temps?
// infos à donner a l'emprunteur:
// remarques du preteur?
// autres infos?
// liste des dernieres etapes

// envoyer un PDF aux banques
// demander une "Date estimée du décaissement" avant les enchères

// 1) email: Mr. a retenu votre offre, documents manquants, conditions nécessaires pour l'offre choisie, piece
// Stratégie d'amortissement et de taux a été choisie -> c'est la suivante
// PDF de la structure du prêt, des détails
// Envoyer une checklist par défaut (conditions, documents, prochaines étapes)
// La banque ne va pas dire non -> envoyer tous les documents
// Banque revient en 2 jours

const downloadPDF = (event, requestId) => {
  event.preventDefault();
  const { target } = event;
  target.innerHTML = '<em>Downloading...</em>';
  target.classList.add('downloading');
  Meteor.call('pdf.download', { requestId }, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      const blob = base64ToBlob(response.base64);
      fileSaver.saveAs(blob, response.fileName);
      target.innerHTML = 'Download';
      target.classList.remove('downloading');
    }
  });
};

const getEmail = props => {
  const subject = `[e-Potek] ${props.loanRequest.property.address1}`;
  const body = 'Bonjour,';
  return `mailto:?subject=${subject}&body=${body}`;
};

export default class ContactLendersPage extends Component {
  render() {
    return (
      <section className="mask1">
        <h1>Contacter les prêteurs</h1>

        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton
            label="Télécharger PDF"
            primary
            onClick={e => downloadPDF(e, this.props.loanRequest._id)}
          />
        </div>

        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton label="Template email" primary href={getEmail(this.props)} />
        </div>

      </section>
    );
  }
}

ContactLendersPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
