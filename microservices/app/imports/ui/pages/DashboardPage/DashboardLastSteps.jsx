import React from 'react';
import PropTypes from 'prop-types';

import colors from 'core/config/colors';

import { T, IntlDate } from 'core/components/Translation';
import DashboardItem from './DashboardItem';

const styles = {
  div: {
    border: `2px solid ${colors.secondary}`,
  },
};

const DashboardLastSteps = props => (
  <DashboardItem
    style={styles.div}
    title={<T id="DashboardLastSteps.title" />}
  >
    <h3 className="text-center">
      <IntlDate
        value={props.loan.general.wantedClosingDate}
        month="long"
        year="numeric"
        weekday="long"
        day="2-digit"
      />
    </h3>

    <hr />
    <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
      <T id="DashboardLastSteps.subtitle" />
    </h4>

    <div>
      <span className="bold">
        <T id="DashboardLastSteps.contract" />
      </span>
      <br />
      <span>
        <T
          id="DashboardLastSteps.progress"
          values={{ value: '0', total: 9 }}
        />
      </span>
    </div>
    <br />
    <div>
      <span className="bold">
        <T id="DashboardLastSteps.closing" />
      </span>
      <br />
      <span>
        <T
          id="DashboardLastSteps.progress"
          values={{ value: '0', total: 7 }}
        />
      </span>
    </div>
  </DashboardItem>
);

DashboardLastSteps.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardLastSteps;
