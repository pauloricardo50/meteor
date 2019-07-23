// @flow
import React from 'react';
import { withProps, compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/pro-light-svg-icons/faFileInvoiceDollar';

import Button from 'core/components/Button';
import DialogContentSection from '../DialogContentSection';

type RealRevenuesDialogContentProps = {
  onClick: Function,
};

const RealRevenuesDialogContent = ({
  onClick,
}: RealRevenuesDialogContentProps) => (
  <div className="loan-status-modifier-dialog-content">
    <DialogContentSection
      title="Insérer des revenus précis"
      description="Il est maintenant nécessaire d'insérer des revenus précis !"
      buttons={(
        <Button
          raised
          primary
          label="Ouvrir l'onglet revenus"
          onClick={onClick}
          icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        />
      )}
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
