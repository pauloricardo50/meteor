// @flow
import React from 'react';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import { S3_ACLS } from 'imports/core/api/constants';
import AutoFormDialog from 'imports/core/components/AutoForm2/AutoFormDialog';
import { Uploader } from 'imports/core/components/UploaderArray/index';
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

export default OrganisationModifierContainer(OrganisationModifier);
