import React from 'react';

import AutoForm from 'core/components/AutoForm2/AutoForm/loadable';
import { dataLayer } from 'core/utils/googleTagManager';

import UserCreatorContainer from './UserCreatorContainer';

const UserCreatorForm = ({ schema, onSubmit, submitFieldProps }) => (
  <AutoForm
    schema={schema}
    onSubmit={onSubmit}
    submitFieldProps={{
      label: 'Créez votre compte',
      raised: true,
      secondary: true,
      style: { width: '100%', marginTop: 16 },
      ...submitFieldProps,
    }}
    style={{ width: '100%' }}
    onSubmitSuccess={() => {
      if (dataLayer()) {
        dataLayer().push({
          event: 'formSubmission',
          formType: 'Purchasing capacity',
        });
      }
    }}
  />
);

export default UserCreatorContainer(UserCreatorForm);
