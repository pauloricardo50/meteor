import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import CircularProgress from 'material-ui/CircularProgress';
import classnames from 'classnames';

import colors from '/imports/js/config/colors';
import { T } from '/imports/ui/components/general/Translation';
import ProgressIcon from './ProgressIcon';

const getStepIcon = ({ step, loanRequest }) => {
  const stepNb = step.nb;
  const realStep = loanRequest.logic.step;
  if (stepNb < realStep) {
    return (
      <div className="icon done">
        <CheckIcon />
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
      <LockIcon />
    </div>
  );
};

const getItemIcon = (item) => {
  if (item.isDone()) {
    return (
      <div className="icon success">
        <CheckIcon color={colors.secondary} />
      </div>
    );
  } else if (item.disabled) {
    return (
      <div className="icon">
        <LockIcon />
      </div>
    );
  } else if (typeof item.percent === 'function') {
    return (
      <div className="icon" style={{ position: 'relative' }}>
        <span className="available-icon" />
        <CircularProgress
          mode="determinate"
          value={item.percent() * 100}
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
          innerStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </div>
    );
  }
  return (
    <div className="icon">
      <span className="available-icon" />
    </div>
  );
};

const SideNavStepperStep = props => (
  <li
    key={props.step.nb}
    className={classnames({ step: true, isActive: props.active })}
  >
    <div className="absolute-line" />
    <div
      className={classnames({ top: true, inactive: props.step.nb === 0 })}
      onClick={props.handleClick}
    >
      {getStepIcon(props)}
      <div className="text">
        <span className="title">
          {props.step.title || <T id={`steps.${props.step.nb}.title`} />}
        </span>
        <span className="subtitle">
          {props.step.subtitle !== undefined ? (
            props.step.subtitle
          ) : (
            <T id={`steps.${props.step.nb}.subtitle`} />
          )}
        </span>
      </div>
    </div>
    {props.active && (
      <ul className="step-list">
        {props.step.items.map(item => (
          <NavLink
            to={
              item.disabled ? (
                props.history.location.pathname
              ) : (
                item.link || props.history.location.pathname
              )
            }
            key={item.id}
            className={classnames({
              item: true,
              disable: item.disabled || !item.link,
            })}
            activeClassName={
              item.link !== undefined && !item.disabled ? 'active' : ''
            }
          >
            <div
              className="onclick-wrapper"
              onClick={item.link ? props.handleClickLink : () => null}
            >
              {getItemIcon(item)}
              <div className="text">
                <span className="title">
                  <T id={`steps.${item.id}.title`} />
                </span>
                <span className="subtitle">
                  <T id={`steps.${item.id}.subtitle`} />
                </span>
              </div>
            </div>
          </NavLink>
        ))}
      </ul>
    )}
  </li>
);

SideNavStepperStep.propTypes = {
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
};

export default SideNavStepperStep;
