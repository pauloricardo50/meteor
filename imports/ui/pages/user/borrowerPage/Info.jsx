import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import { getBorrowerInfoArray } from '/imports/js/arrays/BorrowerFormArray';
import { personalInfoPercent } from '/imports/js/arrays/steps';
import { disableForms } from '/imports/js/helpers/requestFunctions';

import { isDemo } from '/imports/js/helpers/browserFunctions';
import FakeBorrowerCompleter from '/imports/ui/components/general/FakeBorrowerCompleter.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

const BorrowerInfoPage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  const percent = personalInfoPercent([borrower]);

  return (
    <section className="animated fadeIn" key={borrowerId}>
      <hr />
      <h2 className="text-center">
        <T id="Info.title" />
        <br />
        <small className={percent >= 1 && 'success'}>
          <T id="general.progress" values={{ value: percent }} />
          {' '}
          {percent >= 1 && <span className="fa fa-check" />}
        </small>
      </h2>
      <div className="description">
        <p><T id="Forms.mandatory" /></p>
      </div>

      <AutoForm
        inputs={getBorrowerInfoArray(props.borrowers, borrowerId)}
        formClasses="user-form"
        documentId={borrowerId}
        updateFunc="updateBorrower"
        pushFunc="pushBorrowerValue"
        popFunc="popBorrowerValue"
        doc={borrower}
        disabled={disableForms(props.loanRequest)}
      />

      {isDemo() && <FakeBorrowerCompleter borrower={borrower} />}
    </section>
  );
};

BorrowerInfoPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerInfoPage;
