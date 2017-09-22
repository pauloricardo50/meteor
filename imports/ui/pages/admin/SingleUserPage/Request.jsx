import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Icon from '/imports/ui/components/general/Icon';

import { IntlNumber } from '/imports/ui/components/general/Translation';

const Request = ({ loanRequest, borrowers, history }) => (
  <div className="mask1" style={{ marginBottom: 16 }}>
    <h4 style={{ marginBottom: 16 }}>
      {loanRequest.property.address1.toString()}
    </h4>

    <div className="flex admin-request" style={{ flexWrap: 'wrap' }}>
      <div className="flex-col">
        <label htmlFor="">Étape</label>
        <p>{loanRequest.logic.step + 1}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Créé le</label>
        <p>{moment(loanRequest.createdAt).format('D MMM YY à HH:mm:ss')}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Updaté le</label>
        <p>{moment(loanRequest.updatedAt).format('D MMM YY à HH:mm:ss')}</p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Valeur du bien</label>
        <p>
          <IntlNumber value={loanRequest.property.value} format="money" />
        </p>
      </div>

      <div className="flex-col">
        <label htmlFor="">Fortune utilisée</label>
        <p>
          <IntlNumber value={loanRequest.general.fortuneUsed} format="money" />
        </p>
      </div>

      <div className="flex-col">
        <label htmlFor="">2-3e pillier utilisé</label>
        <p>
          <IntlNumber
            value={loanRequest.general.insuranceFortuneUsed}
            format="money"
          />
        </p>
      </div>
    </div>

    <h5>Emprunteurs</h5>
    {borrowers.map(borrower => (
      <Chip style={{ margin: 8 }} key={borrower._id}>
        <Avatar icon={<Icon type="face" />} />
        {borrower.firstName} {borrower.lastName}
      </Chip>
    ))}
  </div>
);

Request.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Request;
