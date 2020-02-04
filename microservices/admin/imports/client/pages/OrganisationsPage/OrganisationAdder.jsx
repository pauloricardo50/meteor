//      
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import Box from 'core/components/Box';
import { OrganisationSchema } from 'core/api/organisations/organisations';

                               
                               
  

const OrganisationAdder = ({ insertOrganisation }                        ) => (
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
    ]}
  />
);

export default OrganisationAdder;
