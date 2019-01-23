// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { changeEmail } from 'core/api';
import { AutoFormDialog } from 'imports/core/components/AutoForm2';

type EmailModifierProps = {};

SimpleSchema.setDefaultMessages({
  messages: { fr: { differentEmail: 'Entrez un email différent' } },
});

const getSchema = oldEmail =>
  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.EmailWithTLD,
      custom() {
        if (this.value === oldEmail) {
          return 'differentEmail';
        }
      },
    },
  });

const handleSubmit = userId => ({ email: newEmail }) =>
  changeEmail.run({ userId, newEmail });

const EmailModifier = ({ userId, email }: EmailModifierProps) => (
  <AutoFormDialog
    buttonProps={{ label: 'Modifer' }}
    title="Changer l'adresse email"
    schema={getSchema(email)}
    onSubmit={handleSubmit(userId)}
  />
);

export default EmailModifier;
