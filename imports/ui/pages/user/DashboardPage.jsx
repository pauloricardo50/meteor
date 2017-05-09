import React from 'react';
import PropTypes from 'prop-types';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import Recap from '/imports/ui/components/general/Recap.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';

const DashboardPage = props => {
  return (
    <section>
      <h1>Tableau de Bord</h1>
      <div className="container-fluid" style={{ width: '100%', padding: 0 }}>
        <div className="col-md-6 col-lg-4" style={{ marginBottom: 15 }}>
          <div className="mask1">
            <h4 className="fixed-size bold">Plan Financier</h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 0,
              }}
            >
              <Recap {...props} arrayName="dashboard" />
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-8">
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
        </div>
      </div>

      {!props.loanRequest.name &&
        <NewRequestModal open requestId={props.loanRequest._id} history={props.history} />}
    </section>
  );
};

DashboardPage.defaultProps = {
  loanRequest: undefined,
  borrowers: [],
};

DashboardPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardPage;
