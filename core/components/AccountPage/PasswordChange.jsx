import { Accounts } from 'meteor/accounts-base';

import React, { Component } from 'react';
import SimpleSchema from 'simpl-schema';

import T from '../Translation';
import { AutoFormDialog } from '../AutoForm2';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: {
      passwordMismatch: 'Entrez 2 fois le même mot de passe',
    },
  },
});

const schema = new SimpleSchema({
  oldPassword: {
    type: String,
    uniforms: { type: 'password', placeholder: null },
  },
  newPassword: {
    type: String,
    min: 8,
    uniforms: { type: 'password', placeholder: null },
  },
  newPassword2: {
    type: String,
    min: 8,
    uniforms: { type: 'password', placeholder: null },
    custom() {
      if (this.value !== this.field('newPassword').value) {
        return 'passwordMismatch';
      }
    },
  },
});

export default class PasswordChange extends Component {
  handleSubmit = ({ oldPassword, newPassword }) =>
    new Promise((resolve, reject) => {
      Accounts.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

  render() {
    return (
      <AutoFormDialog
        schema={schema}
        buttonProps={{
          label: <T id="AccountPage.changePassword" />,
          raised: true,
          primary: true,
        }}
        title={<T id="AccountPage.changePassword" />}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

PasswordChange.propTypes = {};
