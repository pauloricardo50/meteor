import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import { getBorrowerInfoArray } from '/imports/js/arrays/BorrowerFormArray';

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

const BorrowerInfoPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <div style={styles.div}>
      <RaisedButton
        label="Ok"
        containerElement={<Link to={`/app/borrowers/${borrowerId}`} />}
        primary
        style={styles.topButton}
      />

      <section className="mask1">
        <h1>
          {borrower.firstName || "Fiche d'Emprunteur"}
        </h1>

        <div className="description">
          <p>Les champs marqués avec un * sont obligatoires.</p>
        </div>

        <AutoForm
          inputs={getBorrowerInfoArray(props, borrowerId)}
          formClasses="user-form"
          borrowers={props.borrowers}
          documentId={borrowerId}
          updateFunc="updateBorrower"
          pushFunc="pushBorrowerValue"
          popFunc="popBorrowerValue"
        />
      </section>

      <RaisedButton
        label="Ok"
        containerElement={<Link to={`/app/borrowers/${borrowerId}`} />}
        primary
        style={styles.bottomButton}
      />
    </div>
  );
};

BorrowerInfoPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerInfoPage;
