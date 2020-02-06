import React from 'react';
import { withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';

import { sendNegativeFeedbackToAllLenders } from 'core/api/methods';
import Button from 'core/components/Button';
import DialogContentSection from '../DialogContentSection';

const makeSendNegativeFeedbackToAllLenders = (
  loan,
  closeModal,
  returnValue,
) => () => {
  const { _id: loanId, offers = [] } = loan;

  // Don't show duplicate lenders
  const contacts = uniqBy(
    offers,
    ({
      lender: {
        contact: { name },
      },
    }) => name,
  ).map(
    ({
      lender: {
        contact: { name },
        organisation: { name: organisationName },
      },
    }) => `${name} (${organisationName})`,
  );

  if (offers.length) {
    const confirm = window.confirm(
      `Attention: enverra un feedback aux prêteurs suivants:\n\n${contacts.join(
        '\n',
      )}\n\nValider pour envoyer les feedbacks.`,
    );

    if (confirm) {
      return sendNegativeFeedbackToAllLenders
        .run({ loanId })
        .then(() => closeModal({ ...returnValue }));
    }
  }
};

const UnsucessfulFeedback = ({
  sendFeedbackToAllLenders,
  closeModal,
  returnValue,
  enableFeedbackButton,
}) => (
  <div className="loan-status-modifier-dialog-content animated fadeIn">
    <DialogContentSection
      title="Envoyer un feedback à tous les prêteurs"
      description='Envoie un feedback "négatif sans suite" à tous les prêteurs
        sur le dossier.'
      buttons={[
        <Button
          primary
          outlined
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          label="Envoyer un feedback"
          onClick={sendFeedbackToAllLenders}
          key="sendFeedback"
          disabled={!enableFeedbackButton}
          tooltip={!enableFeedbackButton && 'Aucune offre sur ce dossier'}
        />,
        <Button
          error
          outlined
          label="Ne pas envoyer de feedback"
          onClick={() => closeModal({ ...returnValue })}
          key="dontSendFeedback"
        />,
      ]}
      styles={{ buttons: { width: '100%' } }}
    />
  </div>
);

export default withProps(({ loan, closeModal, returnValue }) => ({
  sendFeedbackToAllLenders: makeSendNegativeFeedbackToAllLenders(
    loan,
    closeModal,
    returnValue,
  ),
  enableFeedbackButton: loan && loan.offers && loan.offers.length,
}))(UnsucessfulFeedback);
