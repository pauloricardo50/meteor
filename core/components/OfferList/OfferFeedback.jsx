// @flow
import React from 'react';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import OfferFeedbackContainer from './OfferFeedbackContainer';

type OfferFeedbackProps = {
  offer: Object,
  schema: Object,
  onSubmit: Function,
};

const OfferFeedback = ({ onSubmit, schema, offer }: OfferFeedbackProps) => (
  <AutoFormDialog
    onSubmit={onSubmit}
    schema={schema}
    model={offer}
    buttonProps={{
      label: 'Feedback',
      raised: true,
      primary: true,
    }}
    emptyDialog={!!offer.feedback}
    title="Feedback de l'offre"
    important
  >
    {() => {
      if (offer.feedback) {
        return (
          <>
            <h4>Feedback déjà envoyé</h4>
            <p>{offer.feedback}</p>
          </>
        );
      }
      return null;
    }}
  </AutoFormDialog>
);

export default OfferFeedbackContainer(OfferFeedback);
