import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import FakeBorrowerCompleter
  from '/imports/ui/components/general/FakeBorrowerCompleter.jsx';
import { getBorrowerInfoArray } from '/imports/js/arrays/BorrowerFormArray';
import { personalInfoPercent } from '/imports/js/arrays/steps';

const BorrowerInfoPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  const percent = personalInfoPercent([borrower]);
  return (
    <section className="animated fadeIn">
      <hr />
      <h2 className="text-center">
        Mes Informations Personelles
        <br />
        <small className={percent >= 1 && 'success'}>
          Progrès: {Math.round(percent * 1000) / 10}%
          {' '}
          {percent >= 1 && <span className="fa fa-check" />}
        </small>
      </h2>
      <div className="description">
        <p>Les champs marqués avec un * sont obligatoires.</p>
      </div>

      <AutoForm
        inputs={getBorrowerInfoArray(props.borrowers, borrowerId)}
        formClasses="user-form"
        documentId={borrowerId}
        updateFunc="updateBorrower"
        pushFunc="pushBorrowerValue"
        popFunc="popBorrowerValue"
      />

      <FakeBorrowerCompleter borrower={borrower} />
    </section>
  );
};

BorrowerInfoPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerInfoPage;
