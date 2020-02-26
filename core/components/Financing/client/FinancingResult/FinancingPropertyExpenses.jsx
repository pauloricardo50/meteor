import React from 'react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import { propertyUpdate } from '../../../../api/properties/methodDefinitions';
import T, { Money } from '../../../Translation';
import { LightTheme } from '../../../Themes';
import { FinancingField } from '../FinancingSection/components/FinancingField';

const schema = new SimpleSchema2Bridge(
  new SimpleSchema({
    monthlyPropertyCost: {
      type: Number,
      optional: true,
      uniforms: {
        helperText: <T id="FinancingPropertyExpenses.helperText" />,
      },
    },
  }),
);

const FinancingPropertyExpenses = props => {
  const { loan, structureId, Calculator, structure } = props;

  if (loan.hasPromotion) {
    return (
      <div className="monthlyPropertyCost">
        <Money value={0} />
      </div>
    );
  }

  const property = Calculator.selectProperty({ loan, structureId });

  if (!property._id) {
    return (
      <div className="monthlyPropertyCost">
        <Money value={0} />
      </div>
    );
  }

  return (
    <div className="monthlyPropertyCost">
      <LightTheme>
        <FinancingField
          handleSubmit={({ monthlyPropertyCost }) =>
            propertyUpdate.run({
              propertyId: property._id,
              object: { yearlyExpenses: monthlyPropertyCost * 12 },
            })
          }
          schema={schema}
          value={Math.round(property.yearlyExpenses / 12) || 0}
          structure={structure}
          id="monthlyPropertyCost"
        />
      </LightTheme>
    </div>
  );
};

export default FinancingPropertyExpenses;
