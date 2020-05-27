import React, { useMemo } from 'react';
import SimpleSchema from 'simpl-schema';

import { changeEmail } from '../api/users/methodDefinitions';
import { AutoFormDialog } from './AutoForm2';

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

const EmailModifier = ({ userId, email, buttonLabel = "Modifier l'email" }) => {
  const schema = useMemo(() => getSchema(email), []);

  return (
    <AutoFormDialog
      buttonProps={{ label: buttonLabel, primary: true }}
      title="Changer l'adresse email"
      schema={schema}
      onSubmit={handleSubmit(userId)}
    />
  );
};

export default EmailModifier;
