import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import LockIcon from 'material-ui/svg-icons/action/lock-open';

// const getIcon = ({ step, loanRequest }) => {
//   const stepNb = step.nb;
//   const realStep = loanRequest.logic.step;
//   if (stepNb < realStep) {
//     return <CheckIcon />;
//   } else if (stepNb === realStep) {
//     return <span className="available-icon" />;
//   }
//   return <LockIcon />;
// };

const SideNavStepperStep = props => {
  return (
    <li key={props.step.nb} className="step">
      <div className="absolute-line" />
      <div className="top" onTouchTap={props.handleClick}>
        {/* <div className="icon">{getIcon(props)}</div> */}
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
              to={item.link || props.history.location.pathname}
              key={item.title}
              className="item"
              activeClassName={item.link !== undefined ? 'active' : ''}
              onTouchTap={item.link ? props.handleClickLink : () => null}
            >
              <div className="icon"><CheckIcon /></div>
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
