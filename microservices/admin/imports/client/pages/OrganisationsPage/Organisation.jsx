// @flow
import React from 'react';

import OrganisationContainer from './OrganisationContainer';

type OrganisationProps = {};

const Organisation = ({
  organisation,
  updateOrganisation,
  onClick,
}: OrganisationProps) => {
  const { _id, name, logo = '/img/placeholder.png' } = organisation;
  return (
    <div className="organisation card1 card-hover" key={_id} onClick={onClick}>
      <div className="card-top" style={{ backgroundImage: `url("${logo}")` }} />
      <div className="card-bottom">
        <b>{name}</b>
      </div>
    </div>
  );
};

export default OrganisationContainer(Organisation);
