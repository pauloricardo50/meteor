import React from 'react';

import { COMMISSION_RATES_TYPE } from 'core/api/commissionRates/commissionRateConstants';

import OrganisationContainer from './OrganisationContainer';

const Organisation = ({ organisation, updateOrganisation, onClick }) => {
  const {
    _id,
    name,
    logo = '/img/placeholder.png',
    commissionRates = [],
  } = organisation;
  return (
    <div className="organisation card1 card-hover" key={_id} onClick={onClick}>
      {commissionRates.length > 0 &&
        commissionRates.some(
          ({ type }) => type === COMMISSION_RATES_TYPE.COMMISSIONS,
        ) && <div className="is-paid">$$</div>}
      <div className="card-top" style={{ backgroundImage: `url("${logo}")` }} />
      <div className="card-bottom">
        <b>{name}</b>
      </div>
    </div>
  );
};

export default OrganisationContainer(Organisation);
