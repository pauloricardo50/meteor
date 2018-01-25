import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerInfoArray } from 'core/arrays/BorrowerFormArray';
import { disableForms } from 'core/utils/requestFunctions';

import { isDemo } from 'core/utils/browserFunctions';
import FakeBorrowerCompleter from '/imports/ui/components/FakeBorrowerCompleter';
import { T } from 'core/components/Translation';

const Info = (props) => {
  const { borrowerId } = props.match.params;
  const borrower = props.borrowers.find(b => b._id === borrowerId);

  return (
    <section className="animated fadeIn" key={borrowerId}>
      <hr />
      <h2 className="text-center">
        <T id="Info.title" />
      </h2>
      <div className="description">
        <p>
          <T id="Forms.mandatory" />
        </p>
      </div>

      <AutoForm
        inputs={getBorrowerInfoArray({ ...props, borrowerId })}
        formClasses="user-form"
        docId={borrowerId}
        updateFunc="updateBorrower"
        pushFunc="pushBorrowerValue"
        popFunc="popBorrowerValue"
        doc={borrower}
        disabled={disableForms({ loanRequest: props.loanRequest })}
      />

      {isDemo() && <FakeBorrowerCompleter borrower={borrower} />}
    </section>
  );
};

Info.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Info;
