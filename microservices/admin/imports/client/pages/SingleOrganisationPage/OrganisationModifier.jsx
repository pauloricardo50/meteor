import React from 'react';

import { ONE_KB, S3_ACLS } from 'core/api/files/fileConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import { Uploader } from 'core/components/UploaderArray';

import OrganisationModifierContainer from './OrganisationModifierContainer';

const OrganisationModifier = ({ schema, organisation, updateOrganisation }) => {
  const { _id, documents } = organisation;
  return (
    <AutoFormDialog
      schema={schema}
      model={organisation}
      onSubmit={updateOrganisation}
      buttonProps={{ label: 'Modifier', raised: true, primary: true }}
      title="Modifier organisation"
      layout={[
        {
          Component: Box,
          title: <h4>Général</h4>,
          className: 'mb-32',
          layout: [
            { className: 'grid-col', fields: ['name', 'type'] },
            { fields: ['features', 'tags'] },
          ],
        },
        {
          Component: Box,
          title: <h4>Adresse</h4>,
          className: 'mb-32 grid-2',
          fields: ['address1', 'address2', 'zipCode', 'city'],
        },
        {
          Component: Box,
          title: <h4>Emails</h4>,
          className: 'mb-32',
          fields: ['emails'],
        },
      ]}
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
          displayableFile
          handleSuccess={(file, url) => updateOrganisation({ logo: url })}
        />
      )}
    </AutoFormDialog>
  );
};

export default OrganisationModifierContainer(OrganisationModifier);
