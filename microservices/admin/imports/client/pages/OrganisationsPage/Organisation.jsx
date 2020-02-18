import React from 'react';

import OrganisationContainer from './OrganisationContainer';

const Organisation = ({ organisation, updateOrganisation, onClick }) => {
  const {
    _id,
    name,
    logo = '/img/placeholder.png',
    commissionRates,
  } = organisation;
  return (
    <div className="organisation card1 card-hover" key={_id} onClick={onClick}>
      {commissionRates.length > 0 && <div className="is-paid">$$</div>}
      <div className="card-top" style={{ backgroundImage: `url("${logo}")` }} />
      <div className="card-bottom">
        <b>{name}</b>
      </div>
    </div>
  );
};

export default OrganisationContainer(Organisation);
