import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerInfoArray } from 'core/arrays/BorrowerFormArray';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

const Info = props => {
  const {
    loan: { userFormsEnabled, borrowers, _id: loanId },
  } = props;

  return (
    <section className="animated borrower-page-info flex--helper fadeIn">
      {borrowers.map(borrower => (
        <div className="borrower-page__wrapper col--50" key={borrower._id}>
          <TranslatedAutoForm
            inputs={getBorrowerInfoArray({
              borrowers,
              borrowerId: borrower._id,
              loanId,
            })}
            formClasses="user-form"
            docId={borrower._id}
            collection="borrowers"
            doc={borrower}
            disabled={!userFormsEnabled}
          />
        </div>
      ))}
    </section>
  );
};

Info.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Info;
