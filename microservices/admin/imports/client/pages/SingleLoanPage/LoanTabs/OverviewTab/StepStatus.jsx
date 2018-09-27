import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'core/components/Icon';

import T from 'core/components/Translation';
import { STEP_ORDER } from 'core/api/constants';

const StepStatus = (props) => {
  const currentStep = STEP_ORDER.indexOf(props.loan.logic.step);
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
          <React.Fragment>
            <T id={`steps.${step.nb}.title`} />{' '}
            {currentStep > i && <Icon type="check" />}
          </React.Fragment>
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
