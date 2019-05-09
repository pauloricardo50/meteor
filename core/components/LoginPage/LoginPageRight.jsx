// @flow
import React from 'react';

import { sendVerificationLink } from 'core/api/methods';
import Accounts from './Accounts';

type LoginPageRightProps = {};

const LoginPageRight = ({ path, push }: LoginPageRightProps) => (
  <div className="right">
    <div className="content">
      <Accounts.ui.LoginForm
        onSignedInHook={() => push(path || '/')}
        onPostSignUpHook={() => {
          push(path || '/');
          sendVerificationLink.run({});
        }}
      />
    </div>
  </div>
);

export default LoginPageRight;
