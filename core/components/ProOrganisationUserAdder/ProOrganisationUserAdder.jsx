// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import IconButton from 'core/components/IconButton';
import { proInviteUserToOrganisation } from 'core/api/methods';

type ProOrganisationUserAdderProps = {};

const schema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
  role: { type: String, optional: true },
});

const onSubmit = ({ organisationId }) => ({ role, ...user }) =>
  proInviteUserToOrganisation.run({
    user,
    role,
    organisationId,
  });

const ProOrganisationUserAdder = ({
  organisationId,
  organisationName,
}: ProOrganisationUserAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit({ organisationId })}
    title={`Ajouter utilisateur à ${organisationName}`}
    description="Crée un nouveau compte qui sera automatiquement associé à votre organisation et aura accès à tous les biens immobiliers, promotions et clients de cette organisation."
    triggerComponent={handleOpen => (
      <IconButton
        onClick={handleOpen}
        type="personAdd"
        tooltip={`Ajouter utilisateur à ${organisationName}`}
      />
    )}
  />
);

export default ProOrganisationUserAdder;
