import React, { PropTypes } from 'react';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

const RequestPage = props => {
  return (
    <section className="request-page">
      <h1>{props.loanRequest.name || 'Sans Titre'}</h1>
      <div className="charts">
        <div className="col-xs-12 col-md-6">
          <ProjectPieChart
            loanRequest={props.loanRequest}
            borrowers={props.borrowers}
          />
        </div>
        <div className="col-xs-12 col-md-6">
          <ExpensesChart
            loanRequest={props.loanRequest}
            borrowers={props.borrowers}
          />
        </div>
      </div>
    </section>
  );
};

RequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestPage;
