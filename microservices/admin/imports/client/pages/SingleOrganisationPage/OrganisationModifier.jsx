// @flow
import React from 'react';

import { ORGANISATIONS_COLLECTION, S3_ACLS, ONE_KB } from 'core/api/constants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { Uploader } from 'core/components/UploaderArray';
import Box from 'core/components/Box';
import OrganisationModifierContainer from './OrganisationModifierContainer';

type OrganisationModifierProps = {
  schema: Object,
  organisation: Object,
  updateOrganisation: Function,
};

const OrganisationModifier = ({
  schema,
  organisation,
  updateOrganisation,
}: OrganisationModifierProps) => {
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
        {
          Component: Box,
          title: <h4>Commissionnement</h4>,
          className: 'mb-32',
          fields: ['commissionRates'],
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
            maxSize: 100 * ONE_KB,
          }}
          handleSuccess={(file, url) => updateOrganisation({ logo: url })}
        />
      )}
    </AutoFormDialog>
  );
};

export default OrganisationModifierContainer(OrganisationModifier);
