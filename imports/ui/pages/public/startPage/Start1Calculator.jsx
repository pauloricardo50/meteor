import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import track from '/imports/js/helpers/analytics';

import Button from '/imports/ui/components/general/Button.jsx';
import LoopIcon from 'material-ui/svg-icons/av/loop';

import constants from '/imports/js/config/constants';
import Loadable from '/imports/js/helpers/loadable';

import Accordion from '/imports/ui/components/general/Accordion.jsx';
import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';
import Start1Line from './Start1Line.jsx';
import Start1Recap from './Start1Recap.jsx';
import Start1Validator from './Start1Validator.jsx';

import ExpensesChartInterests from '/imports/ui/components/charts/ExpensesChartInterests.jsx';

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
          {inputArray.map(line =>
            (<Start1Line
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
                )}
            />),
          )}
          <Button
            label="Reset"
            onTouchTap={handleReset}
            className="reset-button"
            icon={<LoopIcon />}
          />
        </div>
        <div className="separator" />
        <div className="recap">
          <Start1Recap {...props} />
        </div>
      </div>

      {isReady &&
        <div className="text-center">
          <Start1Validator
            incomeRatio={incomeRatio}
            borrowRatio={borrowRatio}
          />
        </div>}

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

      {isReady &&
        <div className="button text-center animated fadeIn">
          <Button
            raised
            label={<T id="Start1Page.CTA" />}
            primary={
              borrowRatio <= 0.8 + 0.001 &&
              incomeRatio <= constants.maxRatio + 0.001
            }
            containerElement={<Link to={getUrl()} />}
            id="ok"
            style={{ height: 'unset' }}
            overlayStyle={{ padding: 20 }}
            onTouchTap={() =>
              track('Funnel - Passed Start 1', { property, income, fortune })}
          />
        </div>}
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
