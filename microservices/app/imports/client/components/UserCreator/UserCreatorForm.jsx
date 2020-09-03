import React from 'react';

import AutoForm from 'core/components/AutoForm2/AutoForm';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { dataLayer } from 'core/utils/googleTagManager';

import UserCreatorContainer from './UserCreatorContainer';

const UserCreatorForm = ({
  schema,
  onSubmit,
  submitFieldProps,
  dialog,
  ...rest
}) => {
  const Component = dialog ? AutoFormDialog : AutoForm;
  return (
    <Component
      schema={schema}
      onSubmit={onSubmit}
      submitFieldProps={submitFieldProps}
      style={{ width: '100%' }}
      onSubmitSuccess={() => {
        if (dataLayer()) {
          dataLayer().push({
            event: 'formSubmission',
            formType: 'Purchasing capacity',
          });
        }
      }}
      {...rest}
    />
  );
};

export default UserCreatorContainer(UserCreatorForm);
