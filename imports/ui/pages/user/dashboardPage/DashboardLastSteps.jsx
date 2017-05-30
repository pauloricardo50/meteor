import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import colors from '/imports/js/config/colors';

const styles = {
  div: {
    marginBottom: 15,
    border: `2px solid ${colors.secondary}`,
  },
};

const DashboardLastSteps = props => {
  return (
    <div className="mask1" style={styles.div}>
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>Date de Décaissement</h4>

      <h3 className="text-center">
        {moment(props.loanRequest.general.wantedClosingDate).format('dddd, D MMMM YYYY')}
      </h3>

      <hr />
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>Dernières Étapes</h4>

      <div>
        <span className="bold">Obtenir le contrat</span>
        <br />
        <span>Documents nécessaires: 0/9</span>
      </div>
      <br />
      <div>
        <span className="bold">Décaisser le prêt</span>
        <br />
        <span>Progrès: 0/7</span>
      </div>
    </div>
  );
};

DashboardLastSteps.propTypes = {};

export default DashboardLastSteps;
