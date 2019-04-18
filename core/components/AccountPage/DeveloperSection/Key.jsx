// @flow
import React from 'react';
import { withState } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-light-svg-icons/faKey';
import moment from 'moment';

import Button from '../../Button';
import T from '../../Translation';
import RsaKey from './RsaKey';

type KeyProps = {
  keyValue: String,
  createdAt: Date,
  type: String,
  hideKey: boolean,
  setHideKey: Function,
};

const copyKeyToClipboard = (key) => {
  const dummyInput = document.createElement('input');
  document.body.appendChild(dummyInput);
  dummyInput.setAttribute('value', key);
  dummyInput.select();
  document.execCommand('copy');
  document.body.removeChild(dummyInput);
  import('../../../utils/message').then(({ default: message }) => {
    message.success('Clé copiée dans le presse-papier !');
  });
};

const formatKey = ({ key, type }) =>
  key
    .split(`-----BEGIN RSA ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`)
    .join(`-----BEGIN RSA ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----\n`)
    .split(`-----END RSA ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`)
    .join(`\n-----END RSA ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`);

const Key = ({ keyValue, createdAt, type, hideKey, setHideKey }: KeyProps) => (
  <>
    <div className="key">
      <FontAwesomeIcon icon={faKey} className={`solid icon ${type}-key-icon`} />
      <div className="key-infos">
        <h4>
          <T id={`AccountPage.DevelopperSection.keyType.${type}`} />
          <Button onClick={() => setHideKey(!hideKey)} primary>
            {hideKey ? (
              <T id="AccountPage.DevelopperSection.key.show" />
            ) : (
              <T id="AccountPage.DevelopperSection.key.hide" />
            )}
          </Button>
          <Button onClick={() => copyKeyToClipboard(keyValue)} primary>
            <T id="AccountPage.DevelopperSection.key.copy" />
          </Button>
        </h4>
        <p className="secondary">
          <T
            id="AccountPage.DevelopperSection.key.createdAt"
            values={{ date: moment(createdAt).format('DD MMM YYYY') }}
          />
        </p>
      </div>
    </div>
    <RsaKey keyValue={formatKey({ key: keyValue, type })} hide={hideKey} />
    {type === 'private' && (
      <p className="rsa-key-warning">
        <T id="AccountPage.DevelopperSection.key.warning" />
      </p>
    )}
  </>
);

export default withState('hideKey', 'setHideKey', ({ hidden }) => hidden)(Key);
