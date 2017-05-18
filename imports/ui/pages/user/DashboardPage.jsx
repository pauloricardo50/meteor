import React from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/general/Page.jsx';
import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ProjectBarChart from '/imports/ui/components/charts/ProjectBarChart.jsx';

import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';
import DashboardRecap from './dashboardPage/DashboardRecap.jsx';

const DashboardPage = props => {
  return (
    <Page title="Tableau de Bord">
      <div className="container-fluid" style={{ width: '100%', padding: 0 }}>
        <div className="col-md-6 col-lg-4" style={{ marginBottom: 15 }}>
          <DashboardRecap {...props} />
        </div>

        {/* <div className="col-md-6 col-lg-8">
          <div className="row">
            <div className="col-lg-6 " style={{ marginBottom: 15 }}>
              <div className="mask1">
                <ProjectPieChart {...props} titleAlign="left" />
              </div>
            </div>
            <div className="col-lg-6" style={{ marginBottom: 15 }}>
              <div className="mask1">
                <ExpensesChart {...props} showLegend title="Coût Mensuel" titleAlign="left" />
              </div>
            </div>
          </div>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <div className="mask1">
            <ProjectBarChart {...props} titleAlign="left" />
            <hr style={{ marginTop: 8, marginBottom: 16 }} />
            <ExpensesChart {...props} showLegend title="Coût Mensuel" titleAlign="left" />
          </div>
        </div>
      </div>

      {!props.loanRequest.name &&
        <NewRequestModal open requestId={props.loanRequest._id} history={props.history} />}
    </Page>
  );
};

DashboardPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

DashboardPage.defaultProps = {
  borrowers: [],
};

export default DashboardPage;
