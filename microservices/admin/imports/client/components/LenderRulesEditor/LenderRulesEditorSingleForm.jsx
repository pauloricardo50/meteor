import React from 'react';
import intersection from 'lodash/intersection';

import {
  LenderRulesEditorSchema,
  cutOffCriteria,
  incomeConsideration,
  otherParams,
  theoreticalExpenses,
} from 'core/api/lenderRules/schemas/lenderRulesSchema';
import AutoForm from 'core/components/AutoForm2';
import { CustomAutoField } from 'core/components/AutoForm2/AutoFormComponents';
import CustomSubmitField from 'core/components/AutoForm2/CustomSubmitField';

const getAutoFormParts = formKeys =>
  [
    {
      title: 'Revenus',
      keys: Object.keys(incomeConsideration),
    },
    { title: 'Charges théoriques', keys: Object.keys(theoreticalExpenses) },
    { title: "Critères d'octroi", keys: Object.keys(cutOffCriteria) },
    { title: 'Autres', keys: Object.keys(otherParams) },
  ]
    .map(({ title, keys }) => ({
      title,
      keys: keys.filter(key => formKeys.includes(key)),
    }))
    .filter(({ keys }) => keys.some(key => formKeys.includes(key)));

const LenderRulesEditorSingleForm = ({
  rules,
  formKeys,
  updateLenderRules,
}) => {
  if (
    intersection(formKeys, LenderRulesEditorSchema._schemaKeys).length === 0
  ) {
    return null;
  }

  return (
    <AutoForm
      model={rules}
      onSubmit={updateLenderRules}
      schema={LenderRulesEditorSchema.pick(...formKeys)}
    >
      {getAutoFormParts(formKeys).map(({ title, keys }) => (
        <>
          <h2>{title}</h2>
          {keys.map(key => (
            <CustomAutoField name={key} key={key} />
          ))}
        </>
      ))}
      <CustomSubmitField />
    </AutoForm>
  );
};

export default LenderRulesEditorSingleForm;
