//      
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserDialogFormContainer from './UserDialogFormContainer';
import { userFormLayout } from './UserAdder';

                          
                 
               
                     
                        
  

const UserModifier = ({
  schema,
  user,
  editUser,
  labels,
}                   ) => (
  <AutoFormDialog
    // Emails should not be modified like this, but with EmailModifier
    schema={schema.omit('email', 'assignedEmployeeId', 'sendEnrollmentEmail')}
    model={user}
    onSubmit={editUser}
    buttonProps={{
      label: <T id="UserModifier.buttonLabel" />,
      raised: true,
      primary: true,
    }}
    autoFieldProps={{ labels }}
    layout={userFormLayout[0].layout}
    title={<T id="UserModifier.dialogTitle" />}
  />
);

export default UserDialogFormContainer(UserModifier);
