// @flow
import React from 'react';

import { LenderRulesEditorSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';
import AutoForm from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import { withState } from 'recompose';
import DropdownMenu from 'core/components/DropdownMenu';
import LenderRulesEditorTitle from './LenderRulesEditorTitle';

const getInitialFormKeys = ({ lenderRules }) =>
  Object.keys(lenderRules).filter((key) => {
    const val = lenderRules[key];

    if (val && val.length === 0) {
      return false;
    }

    return val !== undefined || val !== '';
  });

type LenderRulesEditorSingleProps = {};

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
        .filter(key => !formKeys.includes(key))
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
    />
  </div>
);

export default withState('formKeys', 'setFormKeys', getInitialFormKeys)(LenderRulesEditorSingle);
