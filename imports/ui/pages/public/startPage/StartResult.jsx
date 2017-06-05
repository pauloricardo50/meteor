import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChartInterests from '/imports/ui/components/charts/ExpensesChartInterests.jsx';
import Recap from '/imports/ui/components/general/Recap.jsx';
import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';

import constants from '/imports/js/config/constants';
import { saveStartForm } from '/imports/js/helpers/startFunctions';

const styles = {
  h4: {
    lineHeight: '1.5em',
  },
};

const handleClick = ({ formState, setFormState, currentUser, history }) => {
  if (currentUser) {
    saveStartForm(formState, history);
    return;
  }
  setFormState('done', true, () => {
    const options = {
      duration: 350,
      delay: 0,
      smooth: true,
      ignoreCancelEvents: true,
    };
    Meteor.defer(() => Scroll.scroller.scrollTo('done', options));
  });
};

const StartResult = props => {
  let loan = 0;
  if (props.fortuneUsed) {
    loan = props.loanWanted;
  } else {
    loan = props.property * constants.maxLoan(props.usageType, props.toRetirement);
  }

  return (
    <article className="mask1 start-result">
      <h1>
        <T id="StartResult.title" values={{ result: <span className="success">Excellent</span> }} />
      </h1>

      <h1 className="text-center display2" style={{ margin: '40px 0' }}>
        <CountUp
          className="custom-count"
          start={0}
          end={props.lenderCount}
          duration={5}
          useEasing
          separator=" "
          decimal=","
          prefix=""
          suffix={<span>{' '}<T id="StartResult.countSuffix" /></span>}
        />
      </h1>

      <div className="content">
        <Recap {...props} arrayName="start2" />
        <div className="chart">
          <h3>
            {props.type === 'acquisition' && <T id="StartResult.loan" />}
            {props.type === 'test' && <T id="StartResult.maxLoan" />}
            {' '}
            <span className="active"><IntlNumber value={loan} format="money" /></span>
          </h3>
          <ExpensesChartInterests
            loan={loan}
            amortization={loan * constants.getAmortization(props.borrow, props.toRetirement) / 12}
            maintenance={props.propAndWork * constants.maintenanceReal / 12}
          />
        </div>
      </div>

      <div className="description">
        {props.type === 'acquisition' &&
          <h4 style={styles.h4}>
            <T id="StartResult.description1" values={{ count: props.lenderCount }} />
          </h4>}
        {props.type === 'test' &&
          <h4 style={styles.h4}>
            <T
              id="StartResult.description2"
              values={{ value: <IntlNumber value={props.property} format="money" /> }}
            />
          </h4>}
      </div>

      <div className="buttons">
        <RaisedButton
          label={<T id="general.modify" />}
          onTouchTap={() =>
            Scroll.animateScroll.scrollToTop({
              smooth: true,
              duration: 1000,
            })}
          style={{ marginRight: 8 }}
        />
        <RaisedButton
          label={<T id="general.continue" />}
          onTouchTap={
            props.type === 'test'
              ? () => {
                props.setFormState('type', 'acquisition');
                props.setFormState('finalized', undefined);
                props.setFormState('knowsProperty', true);
                props.setFormState('propertyValue', props.property);
              }
              : () => handleClick(props)
          }
          primary
        />
      </div>

    </article>
  );
};

StartResult.defaultProps = {
  propAndWork: 0,
  fortuneUsed: 0,
  project: 0,
  lenderCount: 0,
};

StartResult.propTypes = {
  propAndWork: PropTypes.number,
  project: PropTypes.number,
  fortuneUsed: PropTypes.number,
  lenderCount: PropTypes.number,
  setFormState: PropTypes.func.isRequired,
  property: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default StartResult;
