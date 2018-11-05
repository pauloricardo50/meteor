// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { Uploader } from 'core/components/UploaderArray';
import { OrganizationSchema } from 'core/api/organizations/organizations';
import { ORGANIZATIONS_COLLECTION, S3_ACLS } from 'core/api/constants';
import OrganizationContainer from './OrganizationContainer';

type OrganizationProps = {};

const Organization = ({
  organization,
  updateOrganization,
}: OrganizationProps) => {
  const { _id, name, logo = '/img/placeholder.png', documents } = organization;
  console.log('organization', organization);
  return (
    <AutoFormDialog
      triggerComponent={handleOpen => (
        <div className="organization card1" key={_id} onClick={handleOpen}>
          <div
            className="card-top"
            style={{ backgroundImage: `url("${logo}")` }}
          />
          <div className="card-bottom">
            <h3>{name}</h3>
          </div>
        </div>
      )}
      schema={OrganizationSchema.omit('logo')}
      model={organization}
      onSubmit={updateOrganization}
    >
      {() => (
        <Uploader
          collection={ORGANIZATIONS_COLLECTION}
          docId={_id}
          currentValue={documents && documents.logo}
          fileMeta={{
            id: 'logo',
            label: 'Logo',
            acl: S3_ACLS.PUBLIC_READ,
            noTooltips: true,
          }}
          handleSuccess={(file, url) => updateOrganization({ logo: url })}
        />
      )}
    </AutoFormDialog>
  );
};

export default OrganizationContainer(Organization);
