import React from 'react';
import AutoForm from 'core/components/AutoForm2/AutoForm';
import Box from 'core/components/Box';
import InsuranceForm from './InsuranceForm';

const InsuranceModifier = ({
  schema,
  modifyInsurance,
  loading,
  model,
  ...props
}) => {
  if (loading) {
    return null;
  }

  return (
    <AutoForm
      schema={schema}
      model={model}
      onSubmit={modifyInsurance}
      title="Modifier assurance"
      layout={[
        {
          fields: ['status', 'borrowerId', 'description'],
          Component: Box,
          className: 'grid-col mb-32',
          title: <h3>Général</h3>,
        },
        {
          Component: Box,
          title: <h3>Assurance</h3>,
          layout: [
            {
              fields: [
                'organisationId',
                'type',
                'category',
                'insuranceProductId',
              ],
              Component: Box,
              className: 'grid-row mt-16',
              title: (
                <h3>
                  <small>Produit</small>
                </h3>
              ),
            },
            {
              fields: ['singlePremium', 'premium', 'duration', 'billingDate'],
              Component: Box,
              className: 'grid-row mt-16',
              title: (
                <h3>
                  <small>Prime</small>
                </h3>
              ),
            },
          ],
          className: 'grid-col mb-32',
        },
      ]}
      {...props}
    />
  );
};

export default InsuranceForm(InsuranceModifier);
