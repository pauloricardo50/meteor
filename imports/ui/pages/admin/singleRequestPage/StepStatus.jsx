import React from 'react';
import getSteps from '/imports/js/arrays/steps';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

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
      {steps.map((s, i) => (
        <li key={s.title} style={{ display: 'flex', flexDirection: 'column' }}>
          <div>{s.title} {currentStep > i && <CheckIcon />}</div>
          <ul>
            {s.items.map(item => (
              <li key={item.id}>
                {item.title} {item.isDone() && <CheckIcon />}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

StepStatus.propTypes = {};

export default StepStatus;
