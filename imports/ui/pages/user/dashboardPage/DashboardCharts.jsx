import React from 'react';
import PropTypes from 'prop-types';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ProjectBarChart from '/imports/ui/components/charts/ProjectBarChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

const DashboardCharts = props => {
  // return (
  //   <div className="row">
  //     <div className="col-lg-6 " style={{ marginBottom: 15 }}>
  //       <div className="mask1">
  //         <ProjectPieChart {...props} titleAlign="left" />
  //       </div>
  //     </div>
  //     <div className="col-lg-6" style={{ marginBottom: 15 }}>
  //       <div className="mask1">
  //         <ExpensesChart {...props} showLegend title="Coût Mensuel" titleAlign="left" />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="mask1">
      <ProjectBarChart {...props} titleAlign="left" />
      <hr style={{ marginTop: 8, marginBottom: 16 }} />
      <ExpensesChart {...props} showLegend title="Coût Mensuel" titleAlign="left" />
    </div>
  );
};

DashboardCharts.propTypes = {};

export default DashboardCharts;
