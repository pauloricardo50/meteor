import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Icon from 'core/components/Icon';
import { proInviteUserToOrganisation } from 'core/api/methods';
import T from '../Translation';

const schema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
  title: { type: String, optional: true },
});

const onSubmit = ({ organisationId }) => ({ title, ...user }) =>
  proInviteUserToOrganisation.run({
    user,
    title,
    organisationId,
  });

const ProOrganisationUserAdder = ({
  organisationId,
  organisationName,
  buttonProps,
}) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit({ organisationId })}
    title={
      <T id="ProOrganisationUserAdder.title" values={{ organisationName }} />
    }
    description={
      <T
        id="ProOrganisationUserAdder.description"
        values={{ organisationName }}
      />
    }
    buttonProps={{
      label: 'Nouveau compte',
      icon: <Icon type="add" />,
      raised: true,
      primary: true,
      ...buttonProps,
    }}
  />
);

export default ProOrganisationUserAdder;
