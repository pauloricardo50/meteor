import React from 'react';
import PropTypes from 'prop-types';

import track from 'core/utils/analytics';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

import constants from 'core/config/constants';

import Accordion from 'core/components/Accordion';
import { T, IntlNumber } from 'core/components/Translation';
import Start1Line from './Start1Line';
import Start1Recap from './Start1Recap';
import Start1Validator from './Start1Validator';

import ExpensesChartInterests from 'core/components/charts/ExpensesChartInterests';

const Start1Calculator = (props) => {
  const {
    inputArray,
    income,
    fortune,
    property,
    borrowRatio,
    incomeRatio,
    parentState,
    setStateValue,
    setSliderMax,
    handleReset,
    getUrl,
  } = props;

  const isReady = !!(income && fortune && property);
  const loan = property * 1.05 - fortune;

  return (
    <div style={{ width: '100%' }}>
      <div className="content">
        <div className="sliders">
          {inputArray.map(line => (
            <Start1Line
              isReady={isReady}
              key={line.name}
              {...parentState[line.name]}
              {...line}
              sliderMax={parentState[`${line.name}Slider`]}
              setStateValue={setStateValue}
              setSliderMax={() =>
                setSliderMax(
                  `${line.name}Slider`,
                  parentState[`${line.name}Slider`] + line.sliderIncrement,
                )
              }
            />
          ))}
          <Button
            label="Reset"
            onClick={handleReset}
            className="reset-button"
            icon={<Icon type="loop" />}
          />
        </div>
        <div className="separator" />
        <div className="recap">
          <Start1Recap {...props} />
        </div>
      </div>

      {isReady && (
        <div className="text-center">
          <Start1Validator
            incomeRatio={incomeRatio}
            borrowRatio={borrowRatio}
          />
        </div>
      )}

      <div className="chart text-center">
        <Accordion isActive={isReady && fortune < property}>
          <h3 style={{ margin: '40px 0' }}>
            <T
              id="Start1Page.loanValue"
              description="shows the loan value in large afterwards"
            />{' '}
            <span className="active">
              <IntlNumber
                value={Math.round(loan / 1000) * 1000}
                format="money"
              />
            </span>
          </h3>
          <ExpensesChartInterests
            title="Start1Page.chartTitle"
            loan={loan || 0}
            amortization={
              loan * constants.getAmortization(borrowRatio) / 12 || 0
            }
            maintenance={property * constants.maintenanceReal / 12 || 0}
          />
        </Accordion>
      </div>

      {isReady && (
        <div className="button text-center animated fadeIn">
          <Button
            raised
            label={<T id="Start1Page.CTA" />}
            primary={
              borrowRatio <= 0.8 + 0.001 &&
              incomeRatio <= constants.maxRatio + 0.001
            }
            link
            to={getUrl()}
            id="ok"
            onClick={() =>
              track('Funnel - Passed Start 1', { property, income, fortune })
            }
          />
        </div>
      )}
    </div>
  );
};

Start1Calculator.propTypes = {
  inputArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  income: PropTypes.number.isRequired,
  fortune: PropTypes.number.isRequired,
  property: PropTypes.number.isRequired,
  incomeRatio: PropTypes.number.isRequired,
  borrowRatio: PropTypes.number.isRequired,
  parentState: PropTypes.objectOf(PropTypes.any).isRequired,
  setStateValue: PropTypes.func.isRequired,
  setSliderMax: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  getUrl: PropTypes.func.isRequired,
};

export default Start1Calculator;
