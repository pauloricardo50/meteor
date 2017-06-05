import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import colors from '/imports/js/config/colors';

import { T, IntlDate } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  div: {
    marginBottom: 15,
    border: `2px solid ${colors.secondary}`,
  },
};

const DashboardLastSteps = props => {
  return (
    <div className="mask1" style={styles.div}>
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
        <T id="DashboardLastSteps.title" />
      </h4>

      <h3 className="text-center">
        <IntlDate
          value={props.loanRequest.general.wantedClosingDate}
          month="long"
          year="numeric"
          weekday="long"
          day="2-digit"
        />

        {/* {moment(props.loanRequest.general.wantedClosingDate).format('dddd, D MMMM YYYY')} */}
      </h3>

      <hr />
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
        <T id="DashboardLastSteps.subtitle" />
      </h4>

      <div>
        <span className="bold"><T id="DashboardLastSteps.contract" /></span>
        <br />
        <span><T id="DashboardLastSteps.progress" values={{ value: '0', total: 9 }} /></span>
      </div>
      <br />
      <div>
        <span className="bold"><T id="DashboardLastSteps.closing" /></span>
        <br />
        <span><T id="DashboardLastSteps.progress" values={{ value: '0', total: 7 }} /></span>
      </div>
    </div>
  );
};

DashboardLastSteps.propTypes = {};

export default DashboardLastSteps;
