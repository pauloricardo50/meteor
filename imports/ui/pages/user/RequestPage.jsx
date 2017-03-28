import React, { PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

import MetricsTriple from '/imports/ui/components/general/MetricsTriple.jsx';
import LoanStructureTable
  from '/imports/ui/components/general/LoanStructureTable.jsx';

const handleClick = props => {
  const id = props.loanRequest._id;
  const object = { 'logic.hasValidatedStructure': true };

  cleanMethod('updateRequest', id, object);
};

const RequestPage = props => (
  <section className="request-page mask1">
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

    <MetricsTriple
      loanRequest={props.loanRequest}
      borrowers={props.borrowers}
    />

    <LoanStructureTable
      loanRequest={props.loanRequest}
      borrowers={props.borrowers}
    />

    <div className="text-center">
      <RaisedButton
        label="Valider"
        primary={!props.loanRequest.logic.hasValidatedStructure}
        onTouchTap={() => handleClick(props)}
      />
    </div>
  </section>
);

RequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestPage;
