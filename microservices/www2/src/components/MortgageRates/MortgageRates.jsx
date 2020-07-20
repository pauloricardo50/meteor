import './MortgageRates.scss';

import React, { useContext, useEffect, useState } from 'react';

import T from 'core/components/Translation/FormattedMessage';
import IntlDate from 'core/components/Translation/formattingComponents/IntlDate';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import TrendIcon from './TrendIcon';

const makePercent = num =>
  Number(num).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });

const parseRateType = (language, rateType) => {
  let rateTypeDisplay = rateType.replace('interest', '');

  if (rateTypeDisplay.toLowerCase() !== 'libor') {
    rateTypeDisplay = rateTypeDisplay.concat(
      getLanguageData(language).rateType.suffix,
    );
  }
  return rateTypeDisplay;
};

export const useMortgageRates = () => {
  const [currentRates, setCurrentRates] = useState({});
  useEffect(() => {
    const getCurrentRates = async () => {
      const response = await meteorClient.call(
        'named_query_CURRENT_INTEREST_RATES',
      );
      setCurrentRates(response);
    };
    getCurrentRates();
  }, []);
  return currentRates;
};

const MortgageRates = () => {
  const currentRates = useMortgageRates();
  const [language] = useContext(LanguageContext);

  return (
    <section className="mortgage-rates container">
      {currentRates?.date && (
        <p className="last-update secondary text-center">
          <T id="MortgageRates.lastUpdate" />
          <IntlDate value={currentRates.date} type="relative" style="long" />
        </p>
      )}

      <div className="rates-table text-l">
        <div className="rates-table-header">
          {getLanguageData(language).rateTable.header.map((heading, idx) => (
            <div key={idx} className={`heading-${idx}`}>
              {heading}
            </div>
          ))}
        </div>

        {currentRates?.rates?.map((rate, idx) => (
          <div className="rates-table-line" key={idx}>
            <div className="rate-type">
              {parseRateType(language, rate.type)}
            </div>
            <TrendIcon trend={rate.trend} />
            <div className="rate-range">
              {makePercent(rate.rateLow)} - {makePercent(rate.rateHigh)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MortgageRates;
