import React from 'react';

import Loading from '../Loading';
import T from '../Translation';

const MaxPropertyValueLoading = () => (
  <div className="animated fadeIn text-center">
    <Loading />
    <h4>
      <T defaultMessage="Algorithmes au travail..." />
    </h4>
    <p>
      <T defaultMessage="Détendez-vous un instant" />
    </p>
  </div>
);

export default MaxPropertyValueLoading;
