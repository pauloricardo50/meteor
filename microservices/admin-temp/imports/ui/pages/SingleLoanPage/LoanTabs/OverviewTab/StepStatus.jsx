import React from 'react';
import PropTypes from 'prop-types';
import getSteps from 'core/arrays/steps';
import Icon from 'core/components/Icon';

import { T } from 'core/components/Translation';

const StepStatus = (props) => {
  console.log('steps status props:', props);

  const steps = getSteps(props).slice(1, -1);
  const currentStep = props.loan.logic.step;
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
      {steps.map((s, i) => (
        <li key={s.nb} style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <T id={`steps.${s.nb}.title`} />{' '}
            {currentStep > i && <Icon type="check" />}
          </div>
          <ul>
            {s.items.map(item => (
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
