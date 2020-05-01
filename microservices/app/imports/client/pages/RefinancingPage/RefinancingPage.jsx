import React from 'react';

import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import AutoForm from 'core/components/AutoForm';
import T, { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import PageApp from '../../components/PageApp';
import RefinancingPageTitle from './RefinancingPageTitle';

const RefinancingPage = ({ loan }) => {
  const { userFormsEnabled } = loan;
  const previousLoanValue = Calculator.getPreviousLoanValue({ loan });

  return (
    <PageApp id="RefinancingPage" title={<RefinancingPageTitle loan={loan} />}>
      <section className="card1 card-top refinancing-page">
        <h1>
          <T id="RefinancingPage.pageTitle" />
          {previousLoanValue > 0 && (
            <>
              <br />
              <small className="secondary">
                <Money value={previousLoanValue} />
              </small>
            </>
          )}
        </h1>

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form user-form__info"
            inputs={getRefinancingFormArray({ loan })}
            doc={loan}
            docId={loan._id}
            disabled={!userFormsEnabled}
          />
        </div>
      </section>
    </PageApp>
  );
};

export default RefinancingPage;
