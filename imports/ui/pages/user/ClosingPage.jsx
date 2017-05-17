import React from 'react';
import PropTypes from 'prop-types';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';

const ClosingPage = props => {
  return (
    <ProcessPage {...props} stepNb={3} id="closing" showBottom={false}>
      <div className="mask1">
        <h1>Décaissez votre prêt</h1>
        <div className="description">
          <p>
            Plus que quelques étapes administratives pour obtenir votre prêt.
          </p>
        </div>

        <div style={{ height: 150 }}>
          <LoadingComponent />
        </div>
      </div>
    </ProcessPage>
  );
};

ClosingPage.propTypes = {};

export default ClosingPage;
