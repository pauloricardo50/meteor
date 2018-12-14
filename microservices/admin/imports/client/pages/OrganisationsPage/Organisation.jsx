// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { Uploader } from 'core/components/UploaderArray';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import { ORGANISATIONS_COLLECTION, S3_ACLS } from 'core/api/constants';
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
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default OrganisationContainer(Organisation);
