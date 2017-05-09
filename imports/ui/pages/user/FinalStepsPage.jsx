import React from 'react';
import PropTypes from 'prop-types';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';

const FinalStepsPage = props => {
  return (
    <ProcessPage {...props} stepNb={2} id="finalSteps" showBottom={false}>
      <section className="mask1">
        <h1>Dernières Étapes</h1>
        <div className="description">
          <p>
            Nous avons notifié votre prêteur, nous attendons sa réponse pour vous donner les dernières étapes.
          </p>
        </div>

        <div style={{ height: 150 }}>
          <LoadingComponent />
        </div>
      </section>
    </ProcessPage>
  );
};

FinalStepsPage.propTypes = {};

export default FinalStepsPage;
