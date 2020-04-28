import React from 'react';

import { organisationUpdate } from 'core/api/organisations/methodDefinitions';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import AutoForm from 'core/components/AutoForm2';

const schema = OrganisationSchema.pick('enabledCommissions');

const EnabledCommissionsForm = ({ organisation }) => {
  const { _id: organisationId } = organisation;
  return (
    <AutoForm
      schema={schema}
      model={organisation}
      autosave
      onSubmit={object =>
        organisationUpdate.run({
          organisationId,
          object,
        })
      }
      submitFieldProps={{ showSubmitField: false }}
      style={{ maxWidth: '400px' }}
      className="mb-16"
    />
  );
};

export default EnabledCommissionsForm;
