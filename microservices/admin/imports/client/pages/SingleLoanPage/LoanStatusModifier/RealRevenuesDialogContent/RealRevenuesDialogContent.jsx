import React from 'react';
import { faFileInvoiceDollar } from '@fortawesome/pro-light-svg-icons/faFileInvoiceDollar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import Button from 'core/components/Button';

import DialogContentSection from '../DialogContentSection';

const RealRevenuesDialogContent = ({ onClick }) => (
  <div className="loan-status-modifier-dialog-content">
    <DialogContentSection
      title="Insérer des revenus précis"
      description="Il est maintenant nécessaire d'insérer des revenus précis !"
      buttons={
        <Button
          raised
          primary
          label="Ouvrir l'onglet revenus"
          onClick={onClick}
          icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        />
      }
    />
  </div>
);

export default compose(
  withRouter,
  withProps(({ loan, history, confirmNewStatus, closeModal }) => ({
    onClick: () => {
      confirmNewStatus();
      closeModal();
      history.push(`/loans/${loan._id}/revenues`);
    },
  })),
)(RealRevenuesDialogContent);
