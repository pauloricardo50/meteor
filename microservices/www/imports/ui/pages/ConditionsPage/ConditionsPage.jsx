import React from 'react';
import WwwLayout from '../../WwwLayout';
import Conditions from './Conditions/Loadable';

const AboutPage = () => (
  <WwwLayout className="conditions-page">
    <WwwLayout.TopNav />
    <main className="www-main">
      <div className="conditions-page-content">
        <h1>Conditions générales d'utilisation</h1>
        <Conditions />
      </div>
    </main>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default AboutPage;
