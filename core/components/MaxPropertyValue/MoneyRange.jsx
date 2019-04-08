// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal } from '@fortawesome/pro-light-svg-icons/faSignal';
import cx from 'classnames';

import { Money, Percent } from '../Translation';

type MoneyRangeProps = {
  min: Number,
  max: Number,
  minRatio: Number,
  maxRatio: Number,
};

const MoneyRange = ({ min, max, minRatio, maxRatio, big }: MoneyRangeProps) => {
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <div className={cx('money-range', { big })}>
      <b>
        {isAdmin && minRatio && (
          <span>
            (<Percent value={minRatio} />
            )&nbsp;
          </span>
        )}
        <Money value={min} />
      </b>
      <span className="divider">
        <FontAwesomeIcon icon={faSignal} />
      </span>
      <b>
        {isAdmin && maxRatio && (
          <span>
            (<Percent value={maxRatio} />
            )&nbsp;
          </span>
        )}
        <Money value={max} />
      </b>
    </div>
  );
};

export default MoneyRange;
