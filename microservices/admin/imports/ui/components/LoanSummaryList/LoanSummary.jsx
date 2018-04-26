import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import Icon from 'core/components/Icon';
import { IntlNumber } from 'core/components/Translation';

const LoanSummary = ({
  loan: {
    _id,
    name,
    logic: { step },
    general: { fortuneUsed, insuranceFortuneUsed },
    createdAt,
    updatedAt,
    borrowers,
    property: { value },
  },
}) => (
  <div className="mask1" style={{ marginBottom: 16 }}>
    <h4 style={{ marginBottom: 16 }}>
      <Link to={`/loans/${_id}`}>{name || 'Demande de Prêt'}</Link>
    </h4>

    <div className="flex admin-loan" style={{ flexWrap: 'wrap' }}>
      <div className="flex-col">
        <label htmlFor="">Étape</label>
        <p>{step + 1}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Créé le</label>
        <p>{moment(createdAt).format('D MMM YY à HH:mm:ss')}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Updaté le</label>
        <p>{moment(updatedAt).format('D MMM YY à HH:mm:ss')}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Valeur du bien</label>
        <p>
          <IntlNumber value={value} format="money" />
        </p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Fortune utilisée</label>
        <p>
          <IntlNumber value={fortuneUsed} format="money" />
        </p>
      </div>

      <div className="flex-col">
        <label htmlFor="">2-3e pillier utilisé</label>
        <p>
          {insuranceFortuneUsed ? (
            <IntlNumber value={insuranceFortuneUsed} format="money" />
          ) : (
            '-'
          )}
        </p>
      </div>
    </div>

    <h5>Emprunteurs</h5>
    {borrowers.map(borrower => (
      <Chip
        style={{ margin: 8 }}
        key={borrower._id}
        avatar={
          <Avatar>
            <Icon type="face" />
          </Avatar>
        }
        label={`${borrower.firstName} ${borrower.lastName}`}
      />
    ))}
  </div>
);

LoanSummary.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummary;
