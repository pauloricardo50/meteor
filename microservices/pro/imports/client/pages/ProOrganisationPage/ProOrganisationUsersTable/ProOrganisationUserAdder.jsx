// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import AutoFormDialog from 'imports/core/components/AutoForm2/AutoFormDialog';
import { proInviteUserToOrganisation } from 'core/api/methods/index';

type ProOrganisationUserAdderProps = {};

const schema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
  role: { type: String, optional: true },
});

const onSubmit = ({ organisationId, currentUser }) => ({ role, ...user }) =>
  proInviteUserToOrganisation.run({
    user,
    role,
    organisationId,
    proId: currentUser._id,
  });

const ProOrganisationUserAdder = ({
  organisationId,
  currentUser,
  organisationName,
}: ProOrganisationUserAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit({ organisationId, currentUser })}
    title={`Ajouter utilisateur à ${organisationName}`}
    buttonProps={{
      raised: true,
      primary: true,
      label: `Ajouter utilisateur à ${organisationName}`,
    }}
  />
);

export default ProOrganisationUserAdder;
