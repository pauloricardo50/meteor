import { Accounts } from 'meteor/accounts-base';

import React, { Component } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from '../AutoForm2';
import { passwordSchema } from '../PasswordResetPage/PasswordResetPage';
import T from '../Translation';

const schema = new SimpleSchema({
  oldPassword: {
    type: String,
    uniforms: { type: 'password', placeholder: null },
  },
  ...passwordSchema,
});

export default class PasswordChange extends Component {
  handleSubmit = ({ oldPassword, newPassword }) =>
    new Promise((resolve, reject) => {
      Accounts.changePassword(oldPassword, newPassword, err => {
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
