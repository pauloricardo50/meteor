// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchDollar } from '@fortawesome/pro-light-svg-icons/faSearchDollar';
import { faHourglassHalf } from '@fortawesome/pro-light-svg-icons/faHourglassHalf';
import { faBan } from '@fortawesome/pro-light-svg-icons/faBan';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import DialogContentSection from '../DialogContentSection';
import UnsuccessfulNewLoanContainer from './UnsuccessfulNewLoanContainer';

type UnsuccessfulNewLoanProps = {};

const UnsuccessfulNewLoan = ({
  insertLeadLoan,
  insertPendingLoan,
  setUnsuccessfulOnly,
}: UnsuccessfulNewLoanProps) => (
  <div className="loan-status-modifier-dialog-content animated fadeIn">
    <DialogContentSection
      title="Ouvrir un nouveau dossier"
      description="Ouvre un nouveau dossier pour le client. Copie ses emprunteurs et biens
        immobiliers."
      buttons={[
        <Button
          secondary
          raised
          icon={<FontAwesomeIcon icon={faSearchDollar} />}
          label={<T id="Forms.status.LEAD" />}
          key="lead"
          onClick={insertLeadLoan}
        />,
        <Button
          secondary
          raised
          icon={<FontAwesomeIcon icon={faHourglassHalf} />}
          label={<T id="Forms.status.PENDING" />}
          key="pending"
          onClick={insertPendingLoan}
        />,
        <Button
          error
          outlined
          icon={<FontAwesomeIcon icon={faBan} />}
          label="Ce client est en sans suite"
          onClick={setUnsuccessfulOnly}
          key="unsuccessfulOnly"
        />,
      ]}
      styles={{ buttons: { width: '100%' } }}
    />
  </div>
);

export default UnsuccessfulNewLoanContainer(UnsuccessfulNewLoan);
