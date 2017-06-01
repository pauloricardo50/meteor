import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { analytics } from 'meteor/okgrow:analytics';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LoopIcon from 'material-ui/svg-icons/av/loop';

import constants from '/imports/js/config/constants';

import ExpensesChartInterests from '/imports/ui/components/charts/ExpensesChartInterests.jsx';
import Accordion from '/imports/ui/components/general/Accordion.jsx';
import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';
import Start1Line from './Start1Line.jsx';
import Start1Recap from './Start1Recap.jsx';

const Start1Calculator = props => {
  const isReady = !!(props.income && props.fortune && props.property);
  const loan = props.property * 1.05 - props.fortune;

  return (
    <div style={{ width: '100%' }}>
      <div className="content">
        <div className="sliders">
          {props.inputArray.map(line => (
            <Start1Line
              isReady={isReady}
              key={line.name}
              {...props.parentState[line.name]}
              {...line}
              sliderMax={props.parentState[`${line.name}Slider`]}
              setStateValue={props.setStateValue}
              setSliderMax={() =>
                props.setSliderMax(
                  `${line.name}Slider`,
                  props.parentState[`${line.name}Slider`] + line.sliderIncrement,
                )}
            />
          ))}
          <FlatButton
            label="Reset"
            onTouchTap={props.handleReset}
            className="reset-button"
            icon={<LoopIcon />}
          />
        </div>
        <div className="separator" />
        <div className="recap">
          <Start1Recap {...props} />
        </div>
      </div>

      <div className="chart text-center">
        <Accordion isActive={isReady && props.fortune < props.property}>
          <h3 style={{ margin: '40px 0' }}>
            <T id="Start1Page.loanValue" description="shows the loan value in large afterwards" />
            {' '}
            <span className="active">
              <IntlNumber value={Math.round(loan / 1000) * 1000} format="money" />
            </span>
          </h3>
          <ExpensesChartInterests
            title="Start1Page.chartTitle"
            loan={loan || 0}
            amortization={loan * constants.getAmortization(props.borrowRatio) / 12 || 0}
            maintenance={props.property * constants.maintenanceReal / 12 || 0}
          />
        </Accordion>
      </div>

      {isReady &&
        <div className="button text-center animated fadeIn">
          <RaisedButton
            label={<T id="Start1Page.CTA" />}
            primary={
              props.borrowRatio <= 0.8 + 0.001 && props.incomeRatio <= constants.maxRatio + 0.001
            }
            containerElement={<Link to={props.getUrl()} />}
            id="ok"
            style={{ height: 'unset' }}
            overlayStyle={{ padding: 20 }}
            onTouchTap={() =>
              analytics.track('Passed Start 1', {
                property: props.property,
                income: props.income,
                fortune: props.fortune,
              })}
          />
        </div>}
    </div>
  );
};

Start1Calculator.propTypes = {};

export default Start1Calculator;
