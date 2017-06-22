import React from 'react';
import getSteps from '/imports/js/arrays/steps';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

import { T } from '/imports/ui/components/general/Translation.jsx';

const StepStatus = props => {
  const steps = getSteps(props).slice(1, -1);
  const currentStep = props.loanRequest.logic.step;
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
      {steps.map((s, i) =>
        <li key={s.nb} style={{ display: 'flex', flexDirection: 'column' }}>
          <div><T id={`steps.${s.nb}.title`} /> {currentStep > i && <CheckIcon />}</div>
          <ul>
            {s.items.map(item =>
              <li key={item.id}>
                <T id={`steps.${item.id}.title`} /> {item.isDone() && <CheckIcon />}
              </li>,
            )}
          </ul>
        </li>,
      )}
    </ul>
  );
};

StepStatus.propTypes = {};

export default StepStatus;
