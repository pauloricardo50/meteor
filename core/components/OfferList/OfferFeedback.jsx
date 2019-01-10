// @flow
import React from 'react';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import OfferFeedbackContainer from './OfferFeedbackContainer';

type OfferFeedbackProps = {
  offer: Object,
  schema: Object,
  onSubmit: Function,
};

const getButtonTooltip = ({ lender }) => {
  const {
    contact,
    organisation: { name: organisationName },
  } = lender;
  const { email, name: contactName } = contact || {};
  if (!contact) {
    return `Ajoutez un contact à ${organisationName} pour entrer un feedback`;
  }

  if (!email) {
    return `Ajoutez une adresse email à ${contactName} pour entrer un feedback`;
  }

  return null;
};

const OfferFeedback = ({ onSubmit, schema, offer }: OfferFeedbackProps) => {
  const { lender, feedback } = offer;
  const { contact } = lender;
  const { email } = contact || {};
  return (
    <AutoFormDialog
      onSubmit={onSubmit}
      schema={schema}
      model={offer}
      buttonProps={{
        label: 'Feedback',
        tooltip: getButtonTooltip({ lender }),
        raised: true,
        primary: true,
        disabled: !email,
      }}
      emptyDialog={!!feedback}
      title="Feedback de l'offre"
      important
    >
      {() => {
        if (feedback) {
          return (
            <>
              <h4>Feedback déjà envoyé</h4>
              <p>{feedback}</p>
            </>
          );
        }
        return null;
      }}
    </AutoFormDialog>
  );
};

export default OfferFeedbackContainer(OfferFeedback);
