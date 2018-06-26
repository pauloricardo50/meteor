import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerInfoArray } from 'core/arrays/BorrowerFormArray';

import T from 'core/components/Translation';

const Info = (props) => {
  const {
    loan: { userFormsEnabled, borrowers },
  } = props;

  return (
    <section className="animated borrower-page-info flex--helper fadeIn">
      {borrowers.map(borrower => (
        <div className="borrower-page__wrapper col--50" key={borrower._id}>
          <h2 className="">
            <T id="Info.title" />
          </h2>
          <div className="description">
            <p>
              <T id="Forms.mandatory" />
            </p>
          </div>

          <AutoForm
            inputs={getBorrowerInfoArray({
              borrowers,
              borrowerId: borrower._id,
            })}
            formClasses="user-form user-form__info"
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
