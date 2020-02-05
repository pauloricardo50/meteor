//
import React from 'react';
import moment from 'moment';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import OfferFeedbackContainer from './OfferFeedbackContainer';
import HtmlPreview from '../HtmlPreview';

const getButtonOtherProps = ({ offer }) => {
  let otherProps = {};

  const {
    lender: {
      contact,
      organisation: { name: organisationName },
      loan: { user },
    },
    property,
  } = offer;

  const { assignedEmployee, name: userName } = user || {};
  const { name: assignedEmployeeName, email: assignedEmployeeEmail } =
    assignedEmployee || {};
  const { email: contactEmail, name: contactName } = contact || {};
  const { address1, zipCode, city } = property || {};

  // Should disable button
  if (
    !assignedEmployeeEmail ||
    !contactEmail ||
    !user ||
    !property ||
    !address1 ||
    !zipCode ||
    !city
  ) {
    otherProps = { ...otherProps, disabled: true };
  }

  // Should display tooltip
  if (!user) {
    otherProps = {
      ...otherProps,
      tooltip:
        'Assignez ce dossier à un compte utilisateur pour entrer un feedback',
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
  } else if (!property) {
    otherProps = {
      ...otherProps,
      tooltip: 'Choisissez une propriété pour entrer un feedback',
    };
  } else if (!address1 || !zipCode || !city) {
    otherProps = {
      ...otherProps,
      tooltip: 'Ajoutez une adresse à la propriété pour entrer un feedback',
    };
  }

  return otherProps;
};

const OfferFeedback = ({ onSubmit, schema, offer }) => {
  const { feedback = {} } = offer;
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
        ...getButtonOtherProps({ offer }),
      }}
      emptyDialog={!!message}
      title="Feedback de l'offre"
      important
    >
      {() =>
        message && date ? (
          <>
            <h4>Feedback envoyé le {moment(date).format('DD.MM.YYYY')}</h4>
            <HtmlPreview value={message} />
          </>
        ) : null
      }
    </AutoFormDialog>
  );
};

export default OfferFeedbackContainer(OfferFeedback);
