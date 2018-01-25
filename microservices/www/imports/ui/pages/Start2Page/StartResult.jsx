import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import CountUp from 'react-countup';
import { injectIntl } from 'react-intl';

import Button from 'core/components/Button';
import ExpensesChartInterests from 'core/components/charts/ExpensesChartInterests';
import Recap from 'core/components/Recap';
import { T, IntlNumber } from 'core/components/Translation';
import track from 'core/utils/analytics';
import constants from 'core/config/constants';
import saveStartForm from 'core/utils/saveStartForm';

const styles = {
  h4: {
    lineHeight: '1.5em',
  },
};

const handleClick = ({ formState, setFormState, currentUser }) => {
  if (currentUser) {
    track('Funnel - completed form while logged in', {});
    saveStartForm(formState).then(() => {
      window.location.replace(`${Meteor.settings.public.subdomains.app}`);
    });
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

class StartResult extends Component {
  componentDidMount() {
    track('Funnel - startForm result attained', {});
  }

  render() {
    const {
      fortuneUsed,
      loanWanted,
      property,
      maxLoan,
      usageType,
      toRetirement,
      lenderCount,
      intl,
      type,
      borrow,
      propAndWork,
      setFormState,
    } = this.props;

    let loan = 0;
    if (fortuneUsed) {
      loan = loanWanted;
    } else {
      loan = property * constants.maxLoan(usageType, toRetirement);
    }

    const countSuffix = intl.formatMessage({ id: 'StartResult.countSuffix' });

    return (
      <article className="mask1 start-result">
        <h1>
          <T
            id="StartResult.title"
            values={{ result: <span className="success">Excellent</span> }}
          />
        </h1>

        <h1 className="text-center display2" style={{ margin: '40px 0' }}>
          <CountUp
            className="custom-count"
            start={0}
            end={lenderCount}
            duration={5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix={countSuffix}
          />
        </h1>

        <div className="content">
          <Recap {...this.props} arrayName="start2" />
          <div className="chart">
            <h3>
              {type === 'acquisition' && <T id="StartResult.loan" />}
              {type === 'test' && <T id="StartResult.maxLoan" />}{' '}
              <span className="active">
                <IntlNumber value={loan} format="money" />
              </span>
            </h3>
            <ExpensesChartInterests
              loan={loan}
              amortization={
                loan * constants.getAmortization(borrow, toRetirement) / 12
              }
              maintenance={propAndWork * constants.maintenanceReal / 12}
            />
          </div>
        </div>

        <div className="description">
          {type === 'acquisition' && (
            <h4 style={styles.h4}>
              <T
                id="StartResult.description1"
                values={{ count: lenderCount }}
              />
            </h4>
          )}
          {type === 'test' && (
            <h4 style={styles.h4}>
              <T
                id="StartResult.description2"
                values={{
                  value: <IntlNumber value={property} format="money" />,
                }}
              />
            </h4>
          )}
        </div>

        <div className="buttons">
          <Button
            raised
            label={<T id="general.modify" />}
            onClick={() => {
              track('StartResult - clicked start result modify');

              Scroll.animateScroll.scrollToTop({
                smooth: true,
                duration: 1000,
              });
            }}
            style={{ marginRight: 8 }}
          />
          <Button
            raised
            label={<T id="general.continue" />}
            onClick={() => {
              track('Funnel - clicked start result CTA', { type });

              if (type === 'test') {
                setFormState('type', 'acquisition');
                setFormState('finalized', undefined);
                setFormState('knowsProperty', true);
                setFormState('propertyValue', property);
              } else {
                handleClick(this.props);
              }
            }}
            primary
          />
        </div>
      </article>
    );
  }
}

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

export default injectIntl(StartResult);
