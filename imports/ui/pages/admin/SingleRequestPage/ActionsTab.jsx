import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';

import {
  cancelAuction,
  endAuction,
  deleteRequest,
} from '/imports/api/loanrequests/methods';
import DialogSimple from '/imports/ui/components/general/DialogSimple';
import DropzoneArray from '/imports/ui/components/general/DropzoneArray';
import ClosingForm from '/imports/ui/components/admin/ClosingForm';
import ClosingStepsForm from '/imports/ui/components/admin/ClosingStepsForm';
import downloadPDF from '/imports/js/helpers/download-pdf';
import ConfirmMethod from './ConfirmMethod';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: 8,
  },
  backDrop: {
    backgroundColor: 'transparent',
    display: 'none',
  },
  dialog: {
    width: '100%',
    maxWidth: '80%',
  },
};

const ActionsTab = (props) => {
  const { loanRequest } = props;

  const l = loanRequest.logic;

  return (
    <div style={styles.div}>
      <Button
        raised
        label="Télécharger PDF Anonyme"
        onClick={e => downloadPDF(e, loanRequest._id, 'anonymous')}
        style={styles.button}
      />
      <Button
        raised
        label="Télécharger PDF Complet"
        onClick={e => downloadPDF(e, loanRequest._id, 'default')}
        style={styles.button}
      />

      <ConfirmMethod
        label="Annuler les enchères"
        keyword="ANNULER"
        method={cb => cancelAuction.call({ id: loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auction.status === 'started')}
      />
      <ConfirmMethod
        label="Terminer les enchères"
        keyword="TERMINER"
        method={cb => endAuction.call({ id: loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auction.status === 'started')}
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
          deleteRequest.call({ id: loanRequest._id }, (err) => {
            if (!err) {
              window.location.href = '/admin';
            }
          })}
        style={styles.button}
      />
      <DialogSimple
        title="Uploader contrat"
        label="Uploader contrat"
        buttonStyle={styles.button}
      >
        <div style={{ width: 400 }}>
          <DropzoneArray
            array={[{ id: 'contract' }]}
            docId={loanRequest._id}
            pushFunc="pushRequestValue"
            updateFunc="updateRequest"
            collection="loanRequests"
            filesObject={loanRequest.files}
            filesObjectSelector="files"
            disabled={false}
          />
        </div>
      </DialogSimple>
      <DialogSimple
        title="Étapes du Décaissement"
        label="Étapes du Décaissement"
        passProps
        autoScroll
        cancelOnly
      >
        <ClosingStepsForm loanRequest={loanRequest} />
      </DialogSimple>
    </div>
  );
};

ActionsTab.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ActionsTab;
