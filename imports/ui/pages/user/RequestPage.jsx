import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import { Link } from 'react-router-dom';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

import MetricsTriple from '/imports/ui/components/general/MetricsTriple.jsx';
import LoanStructureTable
  from '/imports/ui/components/general/LoanStructureTable.jsx';

const handleClick = props => {
  const id = props.loanRequest._id;
  const object = { 'logic.hasValidatedStructure': true };

  cleanMethod('updateRequest', object, id, () =>
    Meteor.setTimeout(() => props.history.push('/app'), 300));
};

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
};

const RequestPage = props => (
  <div style={styles.div}>
    <RaisedButton
      label="Retour"
      containerElement={<Link to="/app" />}
      style={styles.topButton}
    />

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
          icon={
            !!props.loanRequest.logic.hasValidatedStructure && <CheckIcon />
          }
        />
      </div>
    </section>
  </div>
);

RequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestPage;
