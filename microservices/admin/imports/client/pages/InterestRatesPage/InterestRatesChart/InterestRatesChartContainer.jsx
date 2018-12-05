import React from 'react';
import { withProps, compose } from 'recompose';
import moment from 'moment';
import { injectIntl } from 'react-intl';

import formatMessage from 'core/utils/intl';
import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import T from 'core/components/Translation/Translation';

const getAverageRate = (rate) => {
  if (!rate || !rate.rateLow || !rate.rateHigh) {
    return null;
  }
  return (100 * (rate.rateLow + rate.rateHigh)) / 2;
};

const getAllRatesOfType = ({ interestRates, type }) =>
  interestRates.reduce(
    (data, rates) => [...data, getAverageRate(rates[type])],
    [],
  );

const getAllDates = interestRates =>
  interestRates.map(({ date }) => moment(date).format('DD.MM.YYYY'));

const getLines = interestRates =>
  Object.values(INTEREST_RATES).map(type => ({
    name: formatMessage(`InterestsTable.${type}`),
    data: getAllRatesOfType({ interestRates, type }),
  }));

export default compose(
  injectIntl,
  withProps(({ interestRates }) => ({
    title: "Taux d'intérêt",
    xLabels: getAllDates(interestRates),
    lines: getLines(interestRates),
  })),
);
