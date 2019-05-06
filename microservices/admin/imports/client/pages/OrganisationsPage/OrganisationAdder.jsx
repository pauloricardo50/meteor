// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganisationSchema } from 'core/api/organisations/organisations';

type OrganisationAdderProps = {
  insertOrganisation: Function,
};

const OrganisationAdder = ({ insertOrganisation }: OrganisationAdderProps) => (
  <AutoFormDialog
    schema={OrganisationSchema.omit(
      'logo',
      'contactIds',
      'canton',
      'userLinks',
      'lenderRulesCount',
      'documents',
    )}
    buttonProps={{
      label: 'Ajouter organisation',
      raised: true,
      primary: true,
    }}
    title="Ajouter organisation"
    onSubmit={insertOrganisation}
  />
);

export default OrganisationAdder;
