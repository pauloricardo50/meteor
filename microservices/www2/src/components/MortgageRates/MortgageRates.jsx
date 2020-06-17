import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TrendIcon from './TrendIcon';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import './MortgageRates.scss';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '23px 0 20px',
    [theme.breakpoints.up('md')]: {
      margin: '40px 0',
    },
  },
}));

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
  const [expanded, setExpanded] = useState(false);
  const [currentRates, setCurrentRates] = useState('');
  const [language] = useContext(LanguageContext);
  const classes = useStyles();

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
      <div className="rates-table">
        <div className="rates-table-header">
          {getLanguageData(language).rateTable.header.map((heading, idx) => (
            <div key={idx} className={`heading-${idx}`}>
              {heading}
            </div>
          ))}
        </div>

        {currentRates &&
          currentRates.rates.map((rate, idx) => (
            <ExpansionPanel
              key={idx}
              expanded={expanded === `panel-${idx}`}
              // onChange={handleChange(`panel-${idx}`)}
            >
              <ExpansionPanelSummary
                // expandIcon={<AddCircleOutlineIcon />}
                aria-controls={`panel-${idx}-content`}
                id={`panel-${idx}-header`}
                classes={classes}
              >
                <div className="rate-type">
                  {parseRateType(language, rate.type)}
                </div>
                <TrendIcon trend={rate.trend} />
                <div className="rate-range">
                  {makePercent(rate.rateLow)} - {makePercent(rate.rateHigh)}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          ))}
      </div>
    </section>
  );
};

export default MortgageRates;
