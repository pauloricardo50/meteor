import './MortgageRateCarousel.scss';

import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import ReactCountUp from 'react-countup';
import useInterval from 'react-use/lib/useInterval';

import T from 'core/components/Translation/FormattedMessage';

import { linkResolver } from '../../utils/linkResolver';
import { useMortgageRates } from '../MortgageRates/MortgageRates';

const MortgageRateCarousel = () => {
  // This is the id of the mortgage rates page
  // will need to be adjusted when we have a 2nd language
  const data = useStaticQuery(graphql`
    query RatesPage {
      prismic {
        allPages(id: "XqidlBAAACQAZ7yf") {
          edges {
            node {
              _meta {
                uid
                lang
                type
              }
            }
          }
        }
      }
    }
  `);
  const [index, setIndex] = useState(2);
  const { rates } = useMortgageRates();
  const hasRates = rates?.length > 0;

  useInterval(() => {
    if (!hasRates) return;

    if (index === rates.length - 1) {
      setIndex(0);
    } else {
      setIndex(i => i + 1);
    }
  }, 5000);

  return (
    <div className="container">
      <h2>
        <T id="MortageRateCarousel.title" />
      </h2>
      <Link
        className="mortgage-rate-carousel"
        to={linkResolver(data?.prismic?.allPages?.edges?.[0]?.node?._meta)}
      >
        <div className="mortgage-rate-carousel-wrapper">
          <hr />
          {hasRates ? (
            <div className="content animated fadeIn" key={index}>
              <div className="secondary animated fadeIn">
                <T id={`WwwCalculatorChartForm.${rates[index].type}`} />
              </div>
              <ReactCountUp
                start={rates[index].rateHigh * 100}
                end={rates[index].rateLow * 100}
                suffix="%"
                decimals={2}
                className="percent animated fadeIn"
                delay={1}
              />
            </div>
          ) : (
            <div className="content" />
          )}
          {/* Add this invisible div above ReactCountUp, as it breaks the link in Safari */}
          <div className="link-wrapper" />
          <hr />
        </div>
      </Link>
    </div>
  );
};

export default MortgageRateCarousel;
