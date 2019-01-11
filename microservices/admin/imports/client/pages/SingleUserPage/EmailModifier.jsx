// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { changeEmail } from 'core/api';
import { AutoFormDialog } from 'imports/core/components/AutoForm2';

type EmailModifierProps = {};

const schema = new SimpleSchema({
  email: { type: String, regEx: SimpleSchema.RegEx.EmailWithTLD },
});

const handleSubmit = userId => ({ email: newEmail }) =>
  changeEmail.run({ userId, newEmail });

const EmailModifier = ({ userId }: EmailModifierProps) => (
  <AutoFormDialog
    buttonProps={{ label: 'Modifer' }}
    title="Changer l'adresse email"
    schema={schema}
    onSubmit={handleSubmit(userId)}
  />
);

export default EmailModifier;
