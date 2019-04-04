// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Money, Percent } from '../Translation';

type MoneyRangeProps = {
  min: Number,
  max: Number,
  minRatio: Number,
  maxRatio: Number,
};

const MoneyRange = ({ min, max, minRatio, maxRatio }: MoneyRangeProps) => {
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <>
      <td className="money-range">
        <span>
          {isAdmin && minRatio && (
            <span>
              (<Percent value={minRatio} />
              )&nbsp;
            </span>
          )}
          <Money value={min} />
        </span>
      </td>
      <td>-</td>
      <td className="money-range">
        <span>
          {isAdmin && maxRatio && (
            <span>
              (<Percent value={maxRatio} />
              )&nbsp;
            </span>
          )}
          <Money value={max} />
        </span>
      </td>
    </>
  );
};

export default MoneyRange;
