import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import colors from '/imports/js/config/colors';

const getStepIcon = ({ step, loanRequest }) => {
  const stepNb = step.nb;
  const realStep = loanRequest.logic.step;
  if (stepNb < realStep) {
    return <div className="icon done"><CheckIcon /></div>;
  } else if (stepNb === realStep) {
    return <div className="icon"><span className="available-icon" /></div>;
  }
  return <div className="icon"><LockIcon /></div>;
};

const getItemIcon = item => {
  if (item.isDone()) {
    return <div className="icon success"><CheckIcon color={colors.secondary} /></div>;
  } else if (item.disabled) {
    return <div className="icon"><LockIcon /></div>;
  }
  return <div className="icon"><span className="available-icon" /></div>;
};

const SideNavStepperStep = props => {
  return (
    <li key={props.step.nb} className="step">
      <div className="absolute-line" />
      <div className="top" onTouchTap={props.handleClick}>
        {getStepIcon(props)}
        <div className="text">
          <span className={`title ${props.currentRequestStep ? 'bold' : ''}`}>
            {props.step.title}
          </span>
          <span className="subtitle">{props.step.subtitle}</span>
        </div>
      </div>
      {props.active &&
        <ul className="step-list">
          {props.step.items.map(item => (
            <NavLink
              to={
                item.disabled
                  ? props.history.location.pathname
                  : item.link || props.history.location.pathname
              }
              key={item.title}
              className="item"
              activeClassName={item.link !== undefined && !item.disabled ? 'active' : ''}
              onTouchTap={item.link ? props.handleClickLink : () => null}
            >
              {getItemIcon(item)}
              <div className="text">
                <span className="title">{item.title}</span>
                <span className="subtitle">{item.subtitle}</span>
              </div>
            </NavLink>
          ))}
        </ul>}
    </li>
  );
};

SideNavStepperStep.propTypes = {
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
};

export default SideNavStepperStep;
