//      
import React from 'react';

import T from 'core/components/Translation';
import AutoForm from 'core/components/AutoForm';
import { LOANS_COLLECTION } from 'core/api/constants';
import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import PageApp from '../../components/PageApp';
import RefinancingPageTitle from './RefinancingPageTitle';

                               

const RefinancingPage = ({ loan }                      ) => {
  const { userFormsEnabled } = loan;
  return (
    <PageApp id="RefinancingPage" title={<RefinancingPageTitle loan={loan} />}>
      <section className="card1 card-top refinancing-page">
        <h1>
          <T id="RefinancingPage.pageTitle" />
        </h1>

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form user-form__info"
            inputs={getRefinancingFormArray({ loan })}
            collection={LOANS_COLLECTION}
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
