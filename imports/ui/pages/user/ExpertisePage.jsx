import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const ExpertisePage = props => {
  return (
    <section className="mask1">
      <h1>L'Expertise</h1>
      <div className="description">
        <p>
          En cliquant sur continuer, nous ferons passer à votre future propriété une expertise en ligne. Ça révelera si votre propriété est au prix correct.
        </p>
      </div>

      <div className="text-center" style={{ margin: '40px 0' }}>
        <RaisedButton label="Continuer" primary />
      </div>
    </section>
  );
};

ExpertisePage.propTypes = {};

export default ExpertisePage;
