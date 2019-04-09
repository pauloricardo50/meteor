// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal } from '@fortawesome/pro-light-svg-icons/faSignal';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import T, { Money, Percent } from '../Translation';

type MoneyRangeProps = {
  min: Number,
  max: Number,
  minRatio: Number,
  maxRatio: Number,
  big: boolean,
};

const MoneyRange = ({ min, max, minRatio, maxRatio, big }: MoneyRangeProps) => (
  <div className={cx('money-range', { big })}>
    <Tooltip
      title={
        minRatio ? (
          <div>
            <T id="Forms.borrowRatio" />
            :&nbsp;
            <Percent value={minRatio} />
          </div>
        ) : (
          ''
        )
      }
    >
      <b>
        <Money value={min} />
      </b>
    </Tooltip>
    <span className="divider">
      <FontAwesomeIcon icon={faSignal} />
    </span>
    <Tooltip
      title={
        maxRatio ? (
          <div>
            <T id="Forms.borrowRatio" />
            :&nbsp;
            <Percent value={maxRatio} />
          </div>
        ) : (
          ''
        )
      }
    >
      <b>
        <Money value={max} />
      </b>
    </Tooltip>
  </div>
);

export default MoneyRange;
