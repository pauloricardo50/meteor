import React from 'react';
import PropTypes from 'prop-types';

import Icon from '/imports/ui/components/general/Icon';
import classnames from 'classnames';

import { T } from '/imports/ui/components/general/Translation';

import Item from './Item';

const getIcon = (step, loanRequest) => {
  const stepNb = step.nb;
  const realStep = loanRequest.logic.step;
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
  loanRequest,
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
        off: nb > loanRequest.logic.step,
      })}
    >
      <div className="absolute-line" />
      <div
        className={classnames({ top: true, inactive: nb === 0 })}
        onClick={handleClick}
      >
        {getIcon(step, loanRequest)}
        <div className="text">
          <span className="title">
            {title || <T id={`steps.${nb}.title`} />}
          </span>
          <span className="subtitle">
            {subtitle !== undefined ? (
              subtitle
            ) : (
              <T id={`steps.${nb}.subtitle`} />
            )}
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
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SideNavStepperStep;
