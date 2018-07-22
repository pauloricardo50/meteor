import React from 'react';

import { IntlDate } from 'core/components/Translation';

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getLastFriday = (testDate) => {
  const prevFriday = testDate ? new Date(testDate) : new Date();
  prevFriday.setHours(getRandomInt(9, 17));
  prevFriday.setMinutes(getRandomInt(0, 59));
  prevFriday.setSeconds(getRandomInt(0, 59));

  if (prevFriday.getDay() === 5) {
    prevFriday.setDate(prevFriday.getDate() - 7);
  } else {
    prevFriday.setDate(prevFriday.getDate() - ((prevFriday.getDay() + 2) % 7));
  }
  return prevFriday;
};

const InterestsTableDate = () => (
  <small className="interests-table-date">
    <IntlDate value={getLastFriday()} />
  </small>
);

export default InterestsTableDate;
