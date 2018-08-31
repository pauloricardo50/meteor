// @flow
import React from 'react';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import { InputAndSlider } from '../FinancingStructuresSection';

import OwnFundsCompleterContainer from './OwnFundsCompleterContainer';

type OwnFundsCompleterProps = {};

const OwnFundsCompleter = (props: OwnFundsCompleterProps) => {
  const { className, hovering, setHover, handleClick, activateButton } = props;

  return (
    <div className={cx(className, 'own-funds-completer')}>
      <Tooltip title="Compléter" placement="left">
        <span
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={cx('top-off-icon', { active: activateButton })}
          onClick={handleClick}
        >
          {hovering
            && activateButton && <span className="appear animated slideInUp" />}
        </span>
      </Tooltip>
      <InputAndSlider {...props} className="" />
    </div>
  );
};

export default OwnFundsCompleterContainer(OwnFundsCompleter);
