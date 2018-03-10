import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import DialogSimple from 'core/components/DialogSimple';
import { AUCTION_STATUS } from 'core/api/constants';
import ClosingForm from '/imports/ui/components/ClosingForm';
import ClosingStepsForm from '/imports/ui/components/ClosingStepsForm';
import downloadPDF from 'core/utils/download-pdf';
import { cancelAuction, endAuction, loanDelete } from 'core/api';
import ConfirmMethod from '../ConfirmMethod';

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
  const { loan } = props;

  const l = loan.logic;

  return (
    <div style={styles.div}>
      <Button
        raised
        label="Télécharger PDF Anonyme"
        onClick={e => downloadPDF(e, loan._id, 'anonymous')}
        style={styles.button}
      />
      <Button
        raised
        label="Télécharger PDF Complet"
        onClick={e => downloadPDF(e, loan._id, 'default')}
        style={styles.button}
      />

      <ConfirmMethod
        label="Annuler les enchères"
        keyword="ANNULER"
        method={cb => cancelAuction.run({ id: loan._id }).then(cb)}
        style={styles.button}
        disabled={!(l.auction.status === AUCTION_STATUS.STARTED)}
      />
      <ConfirmMethod
        label="Terminer les enchères"
        keyword="TERMINER"
        method={cb => endAuction.run({ id: loan._id }).then(cb)}
        style={styles.button}
        disabled={!(l.auction.status === AUCTION_STATUS.STARTED)}
      />
      <DialogSimple
        title="Confirmer le décaissement"
        label="Confirmer décaissement"
        buttonStyle={styles.button}
        passProps
      >
        <ClosingForm loan={loan} />
      </DialogSimple>
      <ConfirmMethod
        label="Supprimer la demande"
        keyword="SUPPRIMER"
        method={cb =>
          loanDelete
            .run({ loanId: loan._id })
            .then(cb)
            .catch((err) => {
              if (!err) {
                window.location.href = '/';
              }
            })
        }
        style={styles.button}
      />
      <DialogSimple
        title="Étapes du Décaissement"
        label="Étapes du Décaissement"
        passProps
        autoScroll
      >
        <ClosingStepsForm loan={loan} />
      </DialogSimple>
    </div>
  );
};

ActionsTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ActionsTab;
