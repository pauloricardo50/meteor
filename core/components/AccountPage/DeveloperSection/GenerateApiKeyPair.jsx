// @flow
import React from 'react';
import { withState } from 'recompose';
import cx from 'classnames';

import Keys from './Keys';
import KeyPairGenerator from './KeyPairGenerator';

type GenerateApiKeyPairProps = {
  keyPair: Object,
  user: Object,
  setKeyPair: Function,
};

const GenerateApiKeyPair = ({
  keyPair = {},
  user,
  setKeyPair,
}: GenerateApiKeyPairProps) => (
  <div className="api-keyPair-generator">
    <div
      className={cx('card1 flex-col', {
        'empty-state': !keyPair.publicKey,
        center: !keyPair.publicKey,
      })}
    >
      <Keys keyPair={keyPair} />
      <KeyPairGenerator user={user} keyPair={keyPair} setKeyPair={setKeyPair} />
    </div>
  </div>
);

export default withState(
  'keyPair',
  'setKeyPair',
  ({ user: { apiPublicKey: { publicKey, createdAt } = {} } }) => ({
    publicKey,
    createdAt,
  }),
)(GenerateApiKeyPair);
