import React from 'react';
import SimpleSchema from 'simpl-schema';

import { address, moneyField } from 'core/api/helpers/sharedSchemas';
import { loanUpdate } from 'core/api/loans/methodDefinitions';
import { previousLoanTranchesSchema } from 'core/api/loans/schemas/otherSchemas';
import { propertyInsert } from 'core/api/properties/methodDefinitions';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import Box from 'core/components/Box';
import { PropertyAdder } from 'core/components/PropertyForm';
import T from 'core/components/Translation';

const propertyFormLayout = [
  {
    Component: Box,
    title: <h4>Bien immobilier</h4>,
    className: 'mb-32',
    layout: [
      { className: 'grid-2', fields: ['value', 'residenceType'] },
      'address1',
      { className: 'grid-col', fields: ['zipCode', 'city', 'country'] },
    ],
  },
  {
    Component: Box,
    title: <h4>Prêt à refinancer</h4>,
    // fields: ['previousLoanTranches.$.value'],
    fields: ['previousLoanTranches'],
  },
];

const schema = new SimpleSchema({
  address1: String,
  city: String,
  country: { ...address.country, optional: false },
  value: {
    ...moneyField,
    optional: false,
    uniforms: { helperText: "La valeur estimée aujourd'hui" },
  },
  zipCode: { ...address.zipCode, optional: false },
  residenceType: {
    type: String,
    allowedValues: Object.values(RESIDENCE_TYPE),
  },
  ...previousLoanTranchesSchema,
});

const SimpleDashboardPagePropertyAdder = ({ loanId }) => {
  const handleSubmit = ({ residenceType, previousLoanTranches, ...property }) =>
    loanUpdate
      .run({
        loanId,
        object: { residenceType, previousLoanTranches },
      })
      .then(() => {
        propertyInsert.run({ property, loanId });
      });

  return (
    <PropertyAdder
      loanId={loanId}
      formDescriptionId="PropertyForm.refinancingDescription"
      triggerComponent={handleOpen => (
        <div
          className="card1 card-top card-hover mb-16 text-center pointer flex-col"
          onClick={handleOpen}
        >
          <span className="plus">+</span>
          <h3>
            <T id="SimpleDashboardPage.refinancingProperty" />
          </h3>
        </div>
      )}
      schema={schema}
      layout={propertyFormLayout}
      onSubmit={handleSubmit}
      model={{ previousLoanTranches: [{}] }}
    />
  );
};

export default SimpleDashboardPagePropertyAdder;
