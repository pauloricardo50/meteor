// @flow
import React from 'react';

import { filterSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';
import AutoForm from 'core/components/AutoForm2';
import LenderRulesEditorTitle from './LenderRulesEditorTitle';

type LenderRulesEditorFilterProps = {};

const LenderRulesEditorFilter = ({
  filterObject: { id, filter, ...rules },
  updateFilter,
}: LenderRulesEditorFilterProps) => (
  <div>
    <h3>
      <LenderRulesEditorTitle filter={filter} />
    </h3>
    <AutoForm
      model={rules}
      onSubmit={updateFilter}
      schema={filterSchema.omit('filter')}
    />
  </div>
);

export default LenderRulesEditorFilter;
