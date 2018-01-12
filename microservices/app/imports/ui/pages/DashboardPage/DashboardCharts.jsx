import React from 'react';
import PropTypes from 'prop-types';

import ProjectPieChart from 'core/components/charts/ProjectPieChart';
import ProjectBarChart from 'core/components/charts/ProjectBarChart';
import ExpensesChart from 'core/components/charts/ExpensesChart';
import DashboardItem from './DashboardItem';

const DashboardCharts = props => (
  <DashboardItem
    menuActions={[
        {
          id: 'financePage',
          link: `/requests/${props.loanRequest._id}/finance`,
        },
      ]}
  >
    <ProjectBarChart {...props} titleAlign="left" />
    <hr style={{ marginTop: 8, marginBottom: 16 }} />
    <ExpensesChart
      {...props}
      showLegend
      title="DashboardCharts.expensesTitle"
      titleAlign="left"
    />
  </DashboardItem>
);

DashboardCharts.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardCharts;
