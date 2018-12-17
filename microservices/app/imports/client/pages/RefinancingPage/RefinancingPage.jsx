// @flow
import React from 'react';

import Page from 'core/components/Page';
import T from 'core/components/Translation';
import AutoForm from 'core/components/AutoForm';
import { LOANS_COLLECTION } from 'core/api/constants';
import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import RefinancingPageTitle from './RefinancingPageTitle';

type RefinancingPageProps = {};

const RefinancingPage = ({ loan }: RefinancingPageProps) => {
  const { userFormsEnabled } = loan;
  return (
    <Page id="RefinancingPage" title={<RefinancingPageTitle loan={loan} />}>
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
    </Page>
  );
};

export default RefinancingPage;
