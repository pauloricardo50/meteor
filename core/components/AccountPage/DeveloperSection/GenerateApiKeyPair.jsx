import React from 'react';
import cx from 'classnames';
import { withState } from 'recompose';

import KeyPairGenerator from './KeyPairGenerator';
import Keys from './Keys';

const GenerateApiKeyPair = ({ keyPair = {}, user, setKeyPair }) => (
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
