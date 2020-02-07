import React from 'react';

import Loading from '../Loading';
import T from '../Translation';

const MaxPropertyValueLoading = () => (
  <div className="animated fadeIn text-center">
    <Loading />
    <h4>
      <T id="MaxPropertyValue.loading1" />
    </h4>
    <p>
      <T id="MaxPropertyValue.loading2" />
    </p>
  </div>
);

export default MaxPropertyValueLoading;
