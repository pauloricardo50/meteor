// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchDollar } from '@fortawesome/pro-light-svg-icons/faSearchDollar';
import { faHourglassHalf } from '@fortawesome/pro-light-svg-icons/faHourglassHalf';
import { faBan } from '@fortawesome/pro-light-svg-icons/faBan';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import TextField from '@material-ui/core/TextField';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import DialogContentSection from '../DialogContentSection';
import UnsuccessfulDialogContentContainer from './UnsuccessfulDialogContentContainer';

type UnsuccessfulDialogContentProps = {
  setUnsuccessfulOnly: Function,
  insertLeadLoan: Function,
  insertPendingLoan: Function,
  shouldDisplayFeedbackButton: Boolean,
  sendFeedbackToAllLenders: Function,
  enableFeedbackButton: Boolean,
  reason: String,
  setReason: Function,
};

const UnsuccessfulDialogContent = ({
  sendFeedbackToAllLenders,
  setUnsuccessfulOnly,
  insertLeadLoan,
  insertPendingLoan,
  shouldDisplayFeedbackButton,
  enableFeedbackButton,
  reason,
  setReason,
}: UnsuccessfulDialogContentProps) => (
  <div className="loan-status-modifier-dialog-content">
    <TextField
      id="reason"
      label="Raison"
      value={reason}
      onChange={(event) => {
        setReason(event.target.value);
      }}
      variant="outlined"
      placeholder="Entrez la raison du passage du dossier à sans suite"
      autoFocus
    />
    {shouldDisplayFeedbackButton && (
      <DialogContentSection
        title="Envoyer un feedback à tous les prêteurs"
        description='Envoie un feedback "négatif sans suite" à tous les prêteurs
        sur le dossier. Vous pourrez ensuite ouvrir ou non un nouveau dossier
        pour le client à l&apos;aide des boutons ci-dessous.'
        buttons={(
          <Button
            primary
            outlined
            icon={<FontAwesomeIcon icon={faEnvelope} />}
            label="Envoyer un feedback"
            onClick={sendFeedbackToAllLenders}
            disabled={!enableFeedbackButton}
          />
        )}
      />
    )}
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
      ]}
    />

    <DialogContentSection
      title="Ne pas ouvrir de nouveau dossier"
      description='Modifie uniquement le statut du dossier en "Sans suite".'
      buttons={(
        <Button
          error
          outlined
          icon={<FontAwesomeIcon icon={faBan} />}
          label="Ce client est en sans suite"
          onClick={setUnsuccessfulOnly}
        />
      )}
    />
  </div>
);

export default UnsuccessfulDialogContentContainer(UnsuccessfulDialogContent);
