//      
import React from 'react';

import MaxPropertyValue from 'core/components/MaxPropertyValue';
import PageApp from '../../components/PageApp';

                            

const SolvencyPage = (props                   ) => (
  <PageApp id="SolvencyPage">
    <div className="solvency-page">
      <MaxPropertyValue {...props} />
    </div>
  </PageApp>
);

export default SolvencyPage;
