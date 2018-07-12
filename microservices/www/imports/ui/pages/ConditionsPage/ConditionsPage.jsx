import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import Conditions from './Conditions/Loadable';

const AboutPage = () => (
  <WwwLayout className="conditions-page">
    <PageHead titleId="ConditionsPage.title" />
    <WwwLayout.TopNav />
    <WwwLayout.Content>
      <div className="conditions-page-content">
        <h1>Conditions générales d'utilisation</h1>
        <Conditions />
      </div>
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
