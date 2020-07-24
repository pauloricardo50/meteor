import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { withState } from 'recompose';

import { LenderRulesEditorSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';
import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';

import LenderRulesEditorSingleForm from './LenderRulesEditorSingleForm';
import LenderRulesEditorTitle from './LenderRulesEditorTitle';
import LenderRulesModifier from './LenderRulesForm/LenderRulesModifier';

const getInitialFormKeys = ({ lenderRules }) =>
  Object.keys(lenderRules).filter(key => {
    const val = lenderRules[key];

    if (val && val.length !== undefined && val.length === 0) {
      return false;
    }

    return val !== undefined || val !== '';
  });

const LenderRulesEditorSingle = ({
  lenderRules: { _id: lenderRulesId, filter, name, order, ...rules },
  updateLenderRules,
  formKeys,
  setFormKeys,
}) => (
  <Accordion className="card1 card-top lender-rules-editor-filter">
    <AccordionSummary>
      <div className="filter-title">
        <LenderRulesEditorTitle filter={filter} name={name} order={order} />
        <LenderRulesModifier
          name={name}
          filter={filter}
          lenderRulesId={lenderRulesId}
        />
      </div>
    </AccordionSummary>

    <AccordionDetails className="lender-rules-editor-filter-details">
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
    </AccordionDetails>
  </Accordion>
);

export default withState(
  'formKeys',
  'setFormKeys',
  getInitialFormKeys,
)(LenderRulesEditorSingle);
