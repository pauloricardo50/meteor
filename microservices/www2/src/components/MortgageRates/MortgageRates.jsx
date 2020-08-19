import './MortgageRates.scss';

import React, { useContext, useEffect, useState } from 'react';

import T from 'core/components/Translation/FormattedMessage';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import callMethod from '../../utils/meteorClient/callMethod';
import TrendIcon from './TrendIcon';

const makePercent = num =>
  Number(num).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });

const parseRateType = (language, rateType) => {
  let rateTypeDisplay = rateType.replace('interest', '');

  if (rateTypeDisplay.toLowerCase() !== 'libor') {
    rateTypeDisplay = getLanguageData(language).rateType.prefix.concat(
      rateTypeDisplay,
    );
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
      const response = await callMethod('named_query_CURRENT_INTEREST_RATES');
      setCurrentRates(response);
    };
    getCurrentRates();
  }, []);
  return currentRates;
};

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

const MortgageRates = () => {
  const currentRates = useMortgageRates();
  const [language] = useContext(LanguageContext);
  const now = new Date();
  const days = Math.round(Math.abs((currentRates.date - now) / oneDay));

  return (
    <section className="mortgage-rates container">
      {currentRates?.date && (
        <p className="last-update secondary text-center">
          <T id="MortgageRates.lastUpdate" values={{ days }} />
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
