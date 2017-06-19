import React from 'react';
import PropTypes from 'prop-types';

import DashboardRecap from './DashboardRecap.jsx';
import DashboardCharts from './DashboardCharts.jsx';
import DashboardBorrowers from './DashboardBorrowers.jsx';
import DashboardLastSteps from './DashboardLastSteps.jsx';
import DashboardUnverified from './DashboardUnverified.jsx';
import DashboardPayments from './DashboardPayments.jsx';

const getArray = props => {
  return [
    {
      components: [{ component: DashboardUnverified, show: !props.currentUser.emails[0].verified }],
      className: 'col-xs-12',
    },
    {
      components: [
        { component: DashboardLastSteps, show: props.loanRequest.logic.step === 3 },
        { component: DashboardPayments, show: props.loanRequest.status === 'done' },
        {
          component: DashboardRecap,
          show: true,
          additionalProps: { hideDetail: props.loanRequest.status === 'done' },
        },
      ],
      className: 'col-md-6 col-lg-4 joyride-recap',
    },
    {
      components: [{ component: DashboardCharts, show: true }],
      className: 'col-md-6 col-lg-4 joyride-charts',
    },
    {
      components: [{ component: DashboardBorrowers, show: true }],
      className: 'col-md-6 col-lg-4 joyride-borrowers',
    },
  ];
};

const DashboardContent = props => {
  return (
    <div className="container-fluid" style={{ width: '100%', padding: 0 }}>
      {getArray(props).map((column, i) =>
        <div className={column.className} style={{ marginBottom: 15 }} key={i}>
          {column.components.map(
            (c, j) => c.show && <c.component {...props} {...c.additionalProps || {}} key={j} />,
          )}
        </div>,
      )}
    </div>
  );
};

DashboardContent.propTypes = {};

export default DashboardContent;
