import React from 'react';
import PropTypes from 'prop-types';

import { STEP_ORDER } from 'core/api/loans/loanConstants';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const StepStatus = props => {
  const currentStep = STEP_ORDER.indexOf(props.loan.step);
  return (
    <ul
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 0,
        listStyle: 'none',
        margin: 20,
      }}
    >
      {STEP_ORDER.map((step, i) => (
        <li key={step.nb} style={{ display: 'flex', flexDirection: 'column' }}>
          <>
            <T id={`steps.${step.nb}.title`} />{' '}
            {currentStep > i && <Icon type="check" />}
          </>
          <ul>
            {step.items.map(item => (
              <li key={item.id}>
                <T id={`steps.${item.id}.title`} />{' '}
                {item.isDone() && <Icon type="check" />}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

StepStatus.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default StepStatus;
