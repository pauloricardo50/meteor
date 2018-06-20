import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import Conditions from './Conditions/Loadable';

const AboutPage = () => (
  <WwwLayout className="conditions-page">
    <PageHead titleId="ConditionsPage.title" />
    <WwwLayout.TopNav />
    <div className="conditions-page-content">
      <h1>
        <T id="ConditionsPage.title" />
      </h1>
      <Conditions />
    </div>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
