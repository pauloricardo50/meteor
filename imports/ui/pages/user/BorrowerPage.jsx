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
    alignSelf: 'flex-start',
  },
  link: {
    margin: '20px 8px',
  },
};

const BorrowerPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);

  return (
    <div style={styles.div}>
      <RaisedButton
        label="Retour"
        containerElement={<Link to="/app/me" />}
        style={styles.topButton}
      />

      <section className="mask1 borrower-page">
        <header className="text-center">
          <span className="fa fa-user-circle-o fa-5x" />
          <h1>
            {borrower.firstName || "Fiche d'Emprunteur"}
          </h1>
          <h3 className="secondary">{`${borrower.age} ans` || ''}</h3>
        </header>

        <article className="borrower-links text-center">
          <Link to={`${props.location.pathname}/info`}>
            <span className="fa fa-user" />
            <h4>Perso</h4>
          </Link>
          <Link to={`${props.location.pathname}/finance`}>
            <span className="fa fa-money" />
            <h4>Finances</h4>
          </Link>
          {/* <Link to={`${props.location.pathname}/documents`}> */}
          <Link to={props.location.pathname}>
            <span className="fa fa-files-o" />
            <h4>Documents</h4>
          </Link>
        </article>
      </section>
    </div>
  );
};

BorrowerPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerPage;
