// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withProps } from 'recompose';

import ConfirmMethod from '../ConfirmMethod';

type AccountResetterProps = {};

const AccountResetter = ({ resetAccount }: AccountResetterProps) => (
  <ConfirmMethod
    method={resetAccount}
    buttonProps={{ label: 'Réinitialiser Yannis', raised: true, primary: true }}
  />
);

export default withProps(({ userId }) => ({
  resetAccount: () =>
    new Promise((resolve, reject) => {
      Meteor.call(
        'resetYannisAccount',
        { userId },
        err => (err ? reject(err) : resolve()),
      );
    }),
}))(AccountResetter);
