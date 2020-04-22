import React, { useMemo } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { address, moneyField } from '../../api/helpers/sharedSchemas';
import { loanUpdate } from '../../api/loans/methodDefinitions';
import { previousLoanTranchesSchema } from '../../api/loans/schemas/otherSchemas';
import { propertyInsert } from '../../api/properties/methodDefinitions';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import Box from '../Box';
import PropertyForm from './PropertyForm';

const PropertyAdderDialog = withProps(
  ({
    loanId,
    category,
    onSubmitSuccess = x => x,
    setOpen,
    isRefinancing,
    ...rest
  }) => {
    const schema = useMemo(
      () =>
        isRefinancing &&
        new SimpleSchema({
          address1: String,
          city: String,
          country: { ...address.country, optional: false },
          value: {
            ...moneyField,
            optional: false,
            uniforms: {
              helperText: "La valeur estimée aujourd'hui",
              ...moneyField.uniforms,
            },
          },
          zipCode: { ...address.zipCode, optional: false },
          residenceType: {
            type: String,
            allowedValues: Object.values(RESIDENCE_TYPE),
          },
          ...previousLoanTranchesSchema,
        }),
      [],
    );

    const layout = [
      {
        Component: Box,
        title: <h4>Bien immobilier</h4>,
        className: 'mb-32',
        layout: [
          {
            className: 'grid-2',
            fields: ['value', isRefinancing && 'residenceType'].filter(x => x),
          },
          'address1',
          { className: 'grid-col', fields: ['zipCode', 'city', 'country'] },
        ],
      },
      isRefinancing && {
        Component: Box,
        title: <h4>Prêt à refinancer</h4>,
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
          });

    return {
      onSubmit: property =>
        onSubmit(property)
          .then(onSubmitSuccess)
          .then(() => setOpen(false)),
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
