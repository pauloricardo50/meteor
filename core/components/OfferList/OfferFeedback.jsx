// @flow
import React from 'react';
import moment from 'moment';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import OfferFeedbackContainer from './OfferFeedbackContainer';

type OfferFeedbackProps = {
  offer: Object,
  schema: Object,
  onSubmit: Function,
};

const getButtonOtherProps = ({ lender }) => {
  let otherProps = {};

  const {
    contact,
    organisation: { name: organisationName },
    loan: { user },
  } = lender;

  const { assignedEmployee, name: userName } = user || {};
  const { name: assignedEmployeeName, email: assignedEmployeeEmail } = assignedEmployee || {};
  const { email: contactEmail, name: contactName } = contact || {};

  // Should disable button
  if (!assignedEmployeeEmail || !contactEmail || !user) {
    otherProps = { ...otherProps, disabled: true };
  }

  // Should display tooltip
  if (!user) {
    otherProps = {
      ...otherProps,
      tooltip: 'Assignez ce dossier à un utilisateur pour entrer un feedback',
    };
  } else if (!assignedEmployee) {
    otherProps = {
      ...otherProps,
      tooltip: `Assignez un conseiller à ${userName} pour entrer un feedback`,
    };
  } else if (!assignedEmployeeEmail) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez une addresse email au conseiller ${assignedEmployeeName} pour entrer un feedback`,
    };
  } else if (!contact) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez un contact à ${organisationName} pour entrer un feedback`,
    };
  } else if (!contactEmail) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez une adresse email au contact ${contactName} pour entrer un feedback`,
    };
  }

  return otherProps;
};

const OfferFeedback = ({ onSubmit, schema, offer }: OfferFeedbackProps) => {
  const { lender, feedback = {} } = offer;
  const { message, date } = feedback;
  return (
    <AutoFormDialog
      onSubmit={onSubmit}
      schema={schema}
      model={offer}
      buttonProps={{
        label: 'Feedback',
        raised: true,
        primary: true,
        ...getButtonOtherProps({ lender }),
      }}
      emptyDialog={!!message}
      title="Feedback de l'offre"
      important
    >
      {() =>
        (message && date ? (
          <>
            <h4>Feedback envoyé le {moment(date).format('DD.MM.YYYY')}</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
          </>
        ) : null)
      }
    </AutoFormDialog>
  );
};

export default OfferFeedbackContainer(OfferFeedback);
