// @flow
import React from 'react';

import MaxPropertyValue from 'core/components/MaxPropertyValue';
import PageApp from '../../components/PageApp';

type SolvencyPageProps = {};

const SolvencyPage = (props: SolvencyPageProps) => (
  <PageApp id="SolvencyPage">
    <div className="solvency-page">
      <MaxPropertyValue {...props} />
    </div>
  </PageApp>
);

export default SolvencyPage;
