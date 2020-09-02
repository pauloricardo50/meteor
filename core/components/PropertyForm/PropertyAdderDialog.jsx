import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { loanUpdate } from '../../api/loans/methodDefinitions';
import { propertyInsert } from '../../api/properties/methodDefinitions';
import Box from '../Box';
import PropertyForm from './PropertyForm';
import refinancingPropertySchema from './refinancingPropertySchema';

const isAdmin = Meteor.microservice === 'admin';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: {
      loanValueTooHigh:
        'Vos tranches de prêt hypothécaire dépassent la valeur de votre bien',
    },
  },
});

const PropertyAdderDialog = withProps(
  ({
    loanId,
    category,
    onSubmitSuccess = x => x,
    setOpen,
    isRefinancing,
    userId,
    ...rest
  }) => {
    const schema = isRefinancing ? refinancingPropertySchema : undefined;

    const layout = [
      {
        Component: Box,
        title: <h5>Bien immobilier</h5>,
        className: 'mb-32',
        layout: [
          {
            className: isRefinancing && 'grid-2',
            fields: ['value', isRefinancing && 'residenceType'].filter(x => x),
          },
          'address1',
          { className: 'grid-col', fields: ['zipCode', 'city', 'country'] },
        ],
      },
      isRefinancing && {
        Component: Box,
        title: <h5>Prêt à refinancer</h5>,
        fields: ['previousLoanTranches'],
      },
    ].filter(x => x);

    const onSubmit = isRefinancing
      ? ({ residenceType, previousLoanTranches, ...property }) =>
          loanUpdate
            .run({
              loanId,
              object: { residenceType, previousLoanTranches },
            })
            .then(() => propertyInsert.run({ property, loanId }))
      : property =>
          propertyInsert.run({
            property: { category, ...property },
            loanId,
            userId: isAdmin ? userId : undefined,
          });

    return {
      onSubmit: property => onSubmit(property).then(onSubmitSuccess),
      form: 'add-property',
      formTitleId: 'PropertyForm.adderDialogTitle',
      formDescriptionId: isRefinancing
        ? 'PropertyForm.refinancingDescription'
        : 'PropertyForm.adderDialogDescription',
      noButton: true,
      onSubmitSuccess: undefined,
      schema,
      layout,
      model: isRefinancing && { previousLoanTranches: [{}] },
      ...rest,
    };
  },
)(PropertyForm);

export default PropertyAdderDialog;
