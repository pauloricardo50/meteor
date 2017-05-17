import React from 'react';
import PropTypes from 'prop-types';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';

const ContractPage = props => {
  return (
    <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
      <div className="mask1">
        <h1>Obtenez le contrat de prêt</h1>
        <div className="description">
          <p>
            Nous avons notifié votre prêteur, nous attendons sa réponse pour vous donner les dernières étapes.
          </p>
        </div>

        <div style={{ height: 150 }}>
          <LoadingComponent />
        </div>
      </div>
    </ProcessPage>
  );
};

ContractPage.propTypes = {};

export default ContractPage;
