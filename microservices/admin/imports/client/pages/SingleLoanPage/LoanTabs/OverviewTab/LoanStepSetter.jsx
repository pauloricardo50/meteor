// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import { STEP_ORDER, LOANS_COLLECTION } from 'core/api/constants';

type LoanStepSetterProps = {};

const LoanStepSetter = ({ loan }: LoanStepSetterProps) => (
  <AutoForm
    doc={loan}
    collection={LOANS_COLLECTION}
    docId={loan._id}
    inputs={[
      {
        id: 'logic.step',
        type: 'selectFieldInput',
        options: STEP_ORDER.map(step => ({
          id: step,
          intlId: 'steps',
        })),
      },
    ]}
    admin
  />
);

export default LoanStepSetter;
