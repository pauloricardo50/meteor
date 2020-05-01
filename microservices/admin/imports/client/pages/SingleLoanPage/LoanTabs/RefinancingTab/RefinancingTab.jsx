import React from 'react';

import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import AutoForm from 'core/components/AutoForm';
import { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

const RefinancingTab = ({ loan }) => {
  const previousLoanValue = Calculator.getPreviousLoanValue({ loan });

  return (
    <div className="refinancing-tab">
      <h1>Refinancement</h1>
      <div className="flex-col center-align">
        {previousLoanValue > 0 && (
          <h2 className="text-center">
            <span>Hypothèque actuelle</span>
            <br />
            <span className="secondary">
              <Money value={previousLoanValue} />
            </span>
          </h2>
        )}
        <AutoForm
          formClasses="user-form user-form__info"
          inputs={getRefinancingFormArray({ loan })}
          doc={loan}
          docId={loan._id}
        />
      </div>
    </div>
  );
};
export default RefinancingTab;
