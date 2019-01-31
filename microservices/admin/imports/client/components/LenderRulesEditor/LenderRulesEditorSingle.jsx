// @flow
import React from 'react';

import {
  LenderRulesEditorSchema,
  incomeConsideration,
  theoreticalExpenses,
  cutOffCriteria,
  otherParams,
} from 'core/api/lenderRules/schemas/lenderRulesSchema';
import AutoForm from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import { withState } from 'recompose';
import DropdownMenu from 'core/components/DropdownMenu';
import CustomSubmitField from 'core/components/AutoForm2/CustomSubmitField';
import { makeCustomAutoField } from 'imports/core/components/AutoForm2/AutoFormComponents';
import LenderRulesEditorTitle from './LenderRulesEditorTitle';

const getInitialFormKeys = ({ lenderRules }) =>
  Object.keys(lenderRules).filter((key) => {
    const val = lenderRules[key];

    if (val && val.length !== undefined && val.length === 0) {
      return false;
    }

    return val !== undefined || val !== '';
  });

type LenderRulesEditorSingleProps = {};

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

const AutoField = makeCustomAutoField();

const LenderRulesEditorSingle = ({
  lenderRules: { filter, ...rules },
  updateLenderRules,
  formKeys,
  setFormKeys,
}: LenderRulesEditorFilterProps) => (
  <div className="card1 card-top lender-rules-editor-filter">
    <h3>
      <LenderRulesEditorTitle filter={filter} />
    </h3>

    <DropdownMenu
      options={LenderRulesEditorSchema._schemaKeys
        .filter(key => !formKeys.includes(key) && !key.includes('$'))
        .map(key => ({
          id: key,
          label: <T id={`Forms.${key}`} />,
          onClick: () => setFormKeys([...formKeys, key]),
        }))}
      button
      buttonProps={{
        label: 'Ajouter critère/règle',
        primary: true,
        raised: true,
        style: { marginBottom: 16 },
      }}
    />

    <AutoForm
      model={rules}
      onSubmit={updateLenderRules}
      schema={LenderRulesEditorSchema.pick(...formKeys)}
    >
      {getAutoFormParts(formKeys).map(({ title, keys }) => (
        <>
          <h2>{title}</h2>
          {keys.map(key => (
            <AutoField name={key} key={key} />
          ))}
        </>
      ))}
      <CustomSubmitField />
    </AutoForm>
  </div>
);

export default withState('formKeys', 'setFormKeys', getInitialFormKeys)(LenderRulesEditorSingle);
