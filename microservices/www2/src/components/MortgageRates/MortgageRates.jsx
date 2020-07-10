import './MortgageRates.scss';

import React, { useContext, useEffect, useState } from 'react';

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

const MortgageRates = () => {
  const [currentRates, setCurrentRates] = useState('');
  const [language] = useContext(LanguageContext);

  useEffect(() => {
    const getCurrentRates = async () => {
      const response = await meteorClient.call(
        'named_query_CURRENT_INTEREST_RATES',
      );
      setCurrentRates(response);
    };
    getCurrentRates();
  }, []);

  return (
    <section className="mortgage-rates container">
      <div className="rates-table text-l">
        <div className="rates-table-header">
          {getLanguageData(language).rateTable.header.map((heading, idx) => (
            <div key={idx} className={`heading-${idx}`}>
              {heading}
            </div>
          ))}
        </div>

        {currentRates &&
          currentRates.rates.map((rate, idx) => (
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
