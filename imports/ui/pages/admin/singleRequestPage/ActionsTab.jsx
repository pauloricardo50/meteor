import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import ConfirmMethod from './ConfirmMethod.jsx';
import {
  cancelAuction,
  finishAuction,
  deleteRequest,
  confirmClosing,
} from '/imports/api/loanrequests/methods';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';
import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';
import ClosingForm from '/imports/ui/components/admin/ClosingForm.jsx';
import LastStepsForm from '/imports/ui/components/admin/LastStepsForm.jsx';
import { downloadPDF } from '/imports/js/helpers/download-pdf';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: 8,
  },
};

const ActionsTab = props => {
  const { serverTime, loanRequest } = props;

  const l = loanRequest.logic;

  return (
    <div style={styles.div}>
      <RaisedButton
        label="Télécharger PDF Anonyme"
        onTouchTap={e => downloadPDF(e, loanRequest._id, 'anonymous')}
        style={styles.button}
      />
      <RaisedButton
        label="Télécharger PDF Complet"
        onTouchTap={e => downloadPDF(e, loanRequest._id, 'default')}
        style={styles.button}
      />

      <ConfirmMethod
        label="Annuler les enchères"
        keyword="ANNULER"
        method={cb => cancelAuction.call({ id: loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auctionStarted && serverTime && serverTime < l.auctionEndTime)}
      />
      <ConfirmMethod
        label="Terminer les enchères"
        keyword="TERMINER"
        method={cb => finishAuction.call({ id: loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auctionStarted && serverTime && serverTime < l.auctionEndTime)}
      />
      <DialogSimple
        title="Confirmer le décaissement"
        label="Confirmer décaissement"
        buttonStyle={styles.button}
        passProps
      >
        <ClosingForm loanRequest={loanRequest} />
      </DialogSimple>
      <ConfirmMethod
        label="Supprimer la demande"
        keyword="SUPPRIMER"
        method={cb =>
          deleteRequest.call({ id: loanRequest._id }, err => {
            if (!err) {
              window.location.href = '/admin';
            }
          })}
        style={styles.button}
      />
      <DialogSimple title="Uploader contrat" label="Uploader contrat" buttonStyle={styles.button}>
        <DropzoneArray
          array={[{ id: 'contract' }]}
          documentId={loanRequest._id}
          pushFunc="pushRequestValue"
          updateFunc="updateRequest"
          collection="loanRequests"
          filesObject={loanRequest.files}
          filesObjectSelector="files"
          disabled={false}
        />
      </DialogSimple>
      <DialogSimple title="Dernières Etapes" label="Dernières Etapes" passProps>
        <LastStepsForm loanRequest={loanRequest} />
      </DialogSimple>
    </div>
  );
};

ActionsTab.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ActionsTab;
