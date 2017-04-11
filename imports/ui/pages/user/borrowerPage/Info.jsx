import React, { PropTypes } from 'react';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import FakeBorrowerCompleter
  from '/imports/ui/components/general/FakeBorrowerCompleter.jsx';
import { getBorrowerInfoArray } from '/imports/js/arrays/BorrowerFormArray';
import { personalInfoPercent } from '/imports/js/arrays/steps';

const BorrowerInfoPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <section className="animated fadeIn">
      <hr />
      <h2 className="text-center">
        Mes Informations Personelles
        <br />
        <small>
          Progrès: {Math.round(personalInfoPercent([borrower]) * 1000) / 10}%
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
