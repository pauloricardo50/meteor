import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import InterestsTableTrend from 'core/components/InterestRatesTable/InterestsTableTrend';
import Percent from 'core/components/Translation/numberComponents/Percent';
import T from 'core/components/Translation/Translation';

const columnOptions = [
  { id: 'date', label: <T id="Forms.date" /> },
  { id: 'interestLibor', label: <T id="InterestsTable.interestLibor" /> },
  { id: 'interest1', label: <T id="InterestsTable.interest1" /> },
  { id: 'interest2', label: <T id="InterestsTable.interest2" /> },
  { id: 'interest5', label: <T id="InterestsTable.interest5" /> },
  { id: 'interest10', label: <T id="InterestsTable.interest10" /> },
  { id: 'interest15', label: <T id="InterestsTable.interest15" /> },
  { id: 'interest20', label: <T id="InterestsTable.interest20" /> },
  { id: 'interest25', label: <T id="InterestsTable.interest25" /> },
];

const interestRatesData = ({ rateLow, rateHigh, trend }) => (
  <div className="interest-rates-data">
    {rateLow && rateHigh && trend ? (
      <>
        <Percent value={rateLow} />
        <span>-</span>
        <Percent value={rateHigh} />
        <InterestsTableTrend trend={trend} />
      </>
    ) : (
      <span>-</span>
    )}
  </div>
);

const makeMapInterestRatesData = interestRates =>
  Object.values(INTEREST_RATES)
    .map(type =>
      interestRates[type]
        ? {
            raw: interestRates[type],
            label: interestRatesData(interestRates[type]),
          }
        : null,
    )
    .filter(x => x);

const makeMapInterestRates = ({
  setInterestRatesToModify,
  setShowDialog,
}) => interestRates => {
  const { _id: interestRatesId, date } = interestRates;

  return {
    id: interestRatesId,
    columns: [
      {
        raw: moment(date).valueOf(),
        label: moment(date).format('DD.MM.YYYY'),
      },
      ...makeMapInterestRatesData(interestRates),
    ],
    handleClick: () => {
      setInterestRatesToModify(interestRates);
      setShowDialog(true);
    },
  };
};

export default compose(
  withState('interestRatesToModify', 'setInterestRatesToModify', null),
  withState('showDialog', 'setShowDialog', false),
  withProps(
    ({ interestRates = [], setInterestRatesToModify, setShowDialog }) => ({
      rows: interestRates.map(
        makeMapInterestRates({ setInterestRatesToModify, setShowDialog }),
      ),
      columnOptions,
    }),
  ),
);
