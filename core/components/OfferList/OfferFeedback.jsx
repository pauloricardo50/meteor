import React from 'react';
import moment from 'moment';

import Calculator from '../../utils/Calculator';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import HtmlPreview from '../HtmlPreview';
import OfferFeedbackContainer from './OfferFeedbackContainer';

const getButtonOtherProps = ({ offer, loan }) => {
  let otherProps = {};
  const { _id: offerId } = offer;
  const {
    contact,
    organisation: { name: organisationName },
  } = Calculator.selectLenderForOfferId({ loan, offerId });
  const property = Calculator.selectProperty({ loan });
  const { userCache } = loan;

  const { name: userName } = userCache || {};
  const { email: contactEmail, name: contactName } = contact || {};
  const { address1, zipCode, city } = property || {};

  // Should disable button
  if (
    !contactEmail ||
    !userCache?._id ||
    !property ||
    !address1 ||
    !zipCode ||
    !city
  ) {
    otherProps = { ...otherProps, disabled: true };
  }

  // Should display tooltip
  if (!userCache?._id) {
    otherProps = {
      ...otherProps,
      tooltip:
        'Assignez ce dossier à un compte utilisateur pour entrer un feedback',
    };
  } else if (!userCache.assignedEmployeeCache?._id) {
    otherProps = {
      ...otherProps,
      tooltip: `Assignez un conseiller à ${userName} pour entrer un feedback`,
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

const OfferFeedback = ({ onSubmit, schema, offer, loan }) => {
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
        ...getButtonOtherProps({ offer, loan }),
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
