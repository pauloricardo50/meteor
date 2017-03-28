import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import getBorrowerFormArray from '/imports/js/arrays/BorrowerFormArray';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  bottomButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
};

const BorrowerPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <div style={styles.div}>
      <RaisedButton
        label="Ok"
        containerElement={<Link to="/app" />}
        primary
        style={styles.topButton}
      />

      <section className="mask1">
        <h1>
          {borrower.firstName || "Fiche d'Emprunteur"}
        </h1>

        <AutoForm
          inputs={getBorrowerFormArray(props, borrowerId)}
          formClasses="col-sm-10 col-sm-offset-1"
          // loanRequest={props.loanRequest}
          borrowers={props.borrowers}
          documentId={borrowerId}
          updateFunc="updateBorrower"
          pushFunc="pushBorrowerValue"
          popFunc="popBorrowerValue"
        />
      </section>

      <RaisedButton
        label="Ok"
        containerElement={<Link to="/app" />}
        primary
        style={styles.bottomButton}
      />
    </div>
  );
};

BorrowerPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerPage;
