// @flow
import React from 'react';
import cx from 'classnames';

import { withState, compose } from 'recompose';
import { InputAndSlider } from '../FinancingStructuresSection';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { calculateRequiredOwnFunds } from './FinancingStructuresOwnFunds';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

type OwnFundsCompleterProps = {};

export const completeValue = (data, fundsToAdd) => {
  const { value, max } = data;

  if (fundsToAdd === 0) {
    return value;
  }

  if (fundsToAdd < 0) {
    return Math.max(value + fundsToAdd, 0);
  }

  const maximumValue = max(data);

  return Math.min(maximumValue, value + fundsToAdd);
};

const OwnFundsCompleter = (props: OwnFundsCompleterProps) => {
  const { className, hovering, setHover, handleChange } = props;
  const fundsToAdd = calculateRequiredOwnFunds(props);
  const activateButton = fundsToAdd !== 0;
  return (
    <div className={cx(className, 'own-funds-completer')}>
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cx('top-off-icon', { active: activateButton })}
        onClick={() =>
          activateButton && handleChange(completeValue(props, fundsToAdd))
        }
      >
        {hovering
          && activateButton && <span className="appear animated slideInUp" />}
      </span>
      <InputAndSlider {...props} className="" />
    </div>
  );
};

export default compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  StructureUpdateContainer,
  withState('hovering', 'setHover', false),
)(OwnFundsCompleter);
