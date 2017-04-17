import React, { PropTypes } from 'react';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

const FinalStepsPage = props => {
  return (
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
  );
};

FinalStepsPage.propTypes = {};

export default FinalStepsPage;
