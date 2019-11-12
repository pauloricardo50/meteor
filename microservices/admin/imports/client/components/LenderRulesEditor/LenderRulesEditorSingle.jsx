// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withState } from 'recompose';

import { LenderRulesEditorSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';
import T from 'core/components/Translation';

import DropdownMenu from 'core/components/DropdownMenu';
import LenderRulesEditorTitle from './LenderRulesEditorTitle';
import LenderRulesModifier from './LenderRulesForm/LenderRulesModifier';
import LenderRulesEditorSingleForm from './LenderRulesEditorSingleForm';

const getInitialFormKeys = ({ lenderRules }) =>
  Object.keys(lenderRules).filter(key => {
    const val = lenderRules[key];

    if (val && val.length !== undefined && val.length === 0) {
      return false;
    }

    return val !== undefined || val !== '';
  });

type LenderRulesEditorSingleProps = {};

const LenderRulesEditorSingle = ({
  lenderRules: { _id: lenderRulesId, filter, name, order, ...rules },
  updateLenderRules,
  formKeys,
  setFormKeys,
}: LenderRulesEditorFilterProps) => (
  <ExpansionPanel className="card1 card-top lender-rules-editor-filter">
    <ExpansionPanelSummary>
      <div className="filter-title">
        <LenderRulesEditorTitle filter={filter} name={name} order={order} />
        <LenderRulesModifier
          name={name}
          filter={filter}
          lenderRulesId={lenderRulesId}
        />
      </div>
    </ExpansionPanelSummary>

    <ExpansionPanelDetails className="lender-rules-editor-filter-details">
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
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default withState(
  'formKeys',
  'setFormKeys',
  getInitialFormKeys,
)(LenderRulesEditorSingle);
