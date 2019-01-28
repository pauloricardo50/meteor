// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm2';
import { LenderRulesMathSchema } from 'core/api/lenderRules/schemas/lenderRulesSchema';

type LenderRulesEditorMathProps = {};

const LenderRulesEditorMath = ({
  filters,
  _id,
  updateMath,
  ...data
}: LenderRulesEditorMathProps) => (
  <div>
    <h3>Considération des informations</h3>
    <AutoForm
      model={data}
      onSubmit={updateMath}
      schema={LenderRulesMathSchema}
    />
  </div>
);

export default LenderRulesEditorMath;
