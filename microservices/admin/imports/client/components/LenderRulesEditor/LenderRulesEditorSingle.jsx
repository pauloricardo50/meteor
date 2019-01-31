// @flow
import React from 'react';

import { LenderRulesEditorSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';
import T from 'core/components/Translation';
import { withState } from 'recompose';
import DropdownMenu from 'core/components/DropdownMenu';

import LenderRulesEditorTitle from './LenderRulesEditorTitle';
import LenderRulesModifier from './LenderRulesForm/LenderRulesModifier';
import LenderRulesEditorSingleForm from './LenderRulesEditorSingleForm';

const getInitialFormKeys = ({ lenderRules }) =>
  Object.keys(lenderRules).filter((key) => {
    const val = lenderRules[key];

    if (val && val.length !== undefined && val.length === 0) {
      return false;
    }

    return val !== undefined || val !== '';
  });

type LenderRulesEditorSingleProps = {};

const LenderRulesEditorSingle = ({
  lenderRules: { _id: lenderRulesId, filter, ...rules },
  updateLenderRules,
  formKeys,
  setFormKeys,
}: LenderRulesEditorFilterProps) => (
  <div className="card1 card-top lender-rules-editor-filter">
    <div className="filter-title">
      <h3>
        <LenderRulesEditorTitle filter={filter} />
      </h3>
      <LenderRulesModifier filter={filter} lenderRulesId={lenderRulesId} />
    </div>

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

    <LenderRulesEditorSingleForm
      formKeys={formKeys}
      rules={rules}
      updateLenderRules={updateLenderRules}
    />
  </div>
);

export default withState('formKeys', 'setFormKeys', getInitialFormKeys)(LenderRulesEditorSingle);
