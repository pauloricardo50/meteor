import React, { useEffect, useState } from 'react';
import meteorClient from '../utils/meteorClient';

const divStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  maxWidth: '800px',
  margin: '30px auto',
  fontSize: '1.2rem',
};

export default () => {
  const [currentRates, setCurrentRates] = useState('');

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
    <div className="rates-table">
      <div className="rates-table-header" style={divStyle}>
        <div>Duree</div>
        <div>Tendance</div>
        <div>Taux</div>
      </div>
      {currentRates &&
        currentRates.rates.map((rate) => (
          <div className="rates-table-row" key={rate.type} style={divStyle}>
            <div>{rate.type}</div>
            <div>{rate.trend}</div>
            <div>
              {rate.rateLow} - {rate.rateHigh}
            </div>
          </div>
        ))}
    </div>
  );
};
