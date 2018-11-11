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
}: OrganisationProps) => {
  const { _id, name, logo = '/img/placeholder.png', documents } = organisation;
  console.log('organisation', organisation);
  return (
    <AutoFormDialog
      triggerComponent={handleOpen => (
        <div
          className="organisation card1 card-hover"
          key={_id}
          onClick={handleOpen}
        >
          <div
            className="card-top"
            style={{ backgroundImage: `url("${logo}")` }}
          />
          <div className="card-bottom">
            <h3>{name}</h3>
          </div>
        </div>
      )}
      schema={OrganisationSchema.omit('logo')}
      model={organisation}
      onSubmit={updateOrganisation}
    >
      {() => (
        <Uploader
          collection={ORGANISATIONS_COLLECTION}
          docId={_id}
          currentValue={documents && documents.logo}
          fileMeta={{
            id: 'logo',
            label: 'Logo',
            acl: S3_ACLS.PUBLIC_READ,
            noTooltips: true,
          }}
          handleSuccess={(file, url) => updateOrganisation({ logo: url })}
        />
      )}
    </AutoFormDialog>
  );
};

export default OrganisationContainer(Organisation);
