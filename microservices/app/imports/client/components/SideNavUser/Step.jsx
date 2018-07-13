import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import classnames from 'classnames';

import T from 'core/components/Translation';

import Item from './Item';

const getIcon = (step, loan) => {
  const stepNb = step.nb;
  const realStep = loan.logic.step;
  if (stepNb < realStep) {
    return (
      <div className="icon done">
        <Icon type="check" />
      </div>
    );
  } else if (stepNb === realStep) {
    return (
      <div className="icon">
        <span className="available-icon" />
      </div>
    );
  }
  return (
    <div className="icon">
      <Icon type="lock" />
    </div>
  );
};

const SideNavStepperStep = ({
  step,
  loan,
  active,
  handleClick,
  handleClickLink,
  history,
}) => {
  const { nb, title, subtitle, items } = step;

  return (
    <li
      key={nb}
      className={classnames({
        step: true,
        isActive: active,
        off: nb > loan.logic.step,
      })}
    >
      <div className="absolute-line" />
      <div
        className={classnames({ top: true, inactive: nb === 0 })}
        onClick={handleClick}
      >
        {getIcon(step, loan)}
        <div className="text">
          <span className="title">
            {title || <T id={`steps.${nb}.title`} />}
          </span>
        </div>
      </div>
      {active && (
        <ul className="step-list">
          {items.map(item => (
            <Item
              item={item}
              key={item.id}
              history={history}
              handleClickLink={handleClickLink}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

SideNavStepperStep.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SideNavStepperStep;
