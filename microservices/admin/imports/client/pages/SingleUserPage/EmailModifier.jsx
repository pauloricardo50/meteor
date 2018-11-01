// @flow
import React from 'react';

import { DialogForm, email } from 'core/components/Form';
import Button from 'core/components/Button';
import { changeEmail } from 'core/api';

type EmailModifierProps = {};

const EmailModifier = ({ userId }: EmailModifierProps) => (
  <DialogForm
    button={<Button>Modifier</Button>}
    title="Changer l'adresse email"
    form="change-email"
    formArray={[{ id: 'email', validate: [email] }]}
    onSubmit={({ email: newEmail }) => changeEmail.run({ userId, newEmail })}
  />
);

export default EmailModifier;
