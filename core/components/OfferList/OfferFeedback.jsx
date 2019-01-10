// @flow
import React from 'react';
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
    loan: {
      user: { assignedEmployee, name: userName },
    },
  } = lender;

  const { name: assignedEmployeeName, email: assignedEmployeeEmail } = assignedEmployee || {};
  const { email: contactEmail, name: contactName } = contact || {};

  // Should disable button
  if (!assignedEmployeeEmail || !contactEmail) {
    otherProps = { ...otherProps, disabled: true };
  }

  // Should display tooltip
  if (!assignedEmployee) {
    otherProps = {
      ...otherProps,
      tooltip: `Assignez un employé à ${userName} pour entrer un feedback`,
    };
  } else if (!assignedEmployeeEmail) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez une addresse email à l'employé ${assignedEmployeeName} pour entrer un feedback`,
    };
  } else if (!contact) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez un contact à ${organisationName} pour entrer un feedback`,
    };
  } else if (!contactEmail) {
    otherProps = {
      ...otherProps,
      tooltip: `Ajoutez une adresse email à ${contactName} pour entrer un feedback`,
    };
  }

  return otherProps;
};

const OfferFeedback = ({ onSubmit, schema, offer }: OfferFeedbackProps) => {
  const { lender, feedback } = offer;
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
      emptyDialog={!!feedback}
      title="Feedback de l'offre"
      important
    >
      {() => {
        if (feedback) {
          return (
            <>
              <h4>Feedback déjà envoyé</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{feedback}</p>
            </>
          );
        }
        return null;
      }}
    </AutoFormDialog>
  );
};

export default OfferFeedbackContainer(OfferFeedback);
