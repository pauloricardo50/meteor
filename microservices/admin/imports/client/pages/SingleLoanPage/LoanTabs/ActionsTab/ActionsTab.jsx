import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import { AUCTION_STATUS } from 'core/api/constants';
import DialogSimple from 'core/components/DialogSimple';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { cancelAuction, endAuction, loanDelete, downloadPDF } from 'core/api';
import ClosingStepsForm from '../../../../components/ClosingStepsForm';

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
    <div className="actions-tab" style={styles.div}>
      <Button
        raised
        label="Télécharger PDF Anonyme"
        onClick={e => downloadPDF.run({})}
        style={styles.button}
      />
      <Button
        raised
        label="Télécharger PDF Complet"
        onClick={e => downloadPDF.run({})}
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
      <ConfirmMethod
        label="Supprimer la demande"
        keyword="SUPPRIMER"
        method={cb =>
          loanDelete
            .run({ loanId: loan._id })
            .then(cb)
            .catch(console.log)
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
