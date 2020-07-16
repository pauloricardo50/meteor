import React from 'react';

import { S3_ACLS } from 'core/api/files/fileConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import { Uploader } from 'core/components/UploaderArray';

import OrganisationModifierContainer from './OrganisationModifierContainer';

const OrganisationModifier = ({ schema, organisation, updateOrganisation }) => {
  const { _id, documents, _collection } = organisation;
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
          title: <h5>Général</h5>,
          className: 'mb-32',
          layout: [
            { className: 'grid-2', fields: ['name', 'type'] },
            { className: 'grid-2', fields: ['features', 'tags'] },
            { fields: 'assigneeLink' },
          ],
        },
        {
          Component: Box,
          title: <h5>Adresse</h5>,
          className: 'mb-32 grid-2',
          fields: ['address1', 'address2', 'zipCode', 'city'],
        },
        {
          Component: Box,
          title: <h5>Emails</h5>,
          className: 'mb-32',
          fields: ['emails'],
        },
      ]}
    >
      {() => (
        <Uploader
          collection={_collection}
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
