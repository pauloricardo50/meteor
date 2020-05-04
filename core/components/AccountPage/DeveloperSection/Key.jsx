import React from 'react';
import { faKey } from '@fortawesome/pro-light-svg-icons/faKey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { withState } from 'recompose';

import Button from '../../Button';
import T from '../../Translation';
import RsaKey from './RsaKey';

const copyKeyToClipboard = key => {
  const dummyInput = document.createElement('textarea');
  dummyInput.value = key;
  document.body.appendChild(dummyInput);
  dummyInput.select();
  document.execCommand('copy');
  document.body.removeChild(dummyInput);
  import('../../../utils/message').then(({ default: message }) => {
    message.success('Clé copiée dans le presse-papier !');
  });
};

const formatKey = keyValue => {
  const [header, key, footer] = keyValue
    .split(
      /(\W+\w+\s+\w+\s+\w+\s+\w+\W+)([A-Za-z0-9+\/=]+)(\W+\w+\s+\w+\s+\w+\s+\w+\W+)/g,
    )
    .filter(x => x);

  return `${header}\n${key.match(/.{1,45}/g).join('\n')}\n${footer}`;
};

const Key = ({ keyValue, createdAt, type, hideKey, setHideKey }) => (
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
          <Button
            onClick={() => copyKeyToClipboard(formatKey(keyValue))}
            primary
          >
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
    <RsaKey keyValue={formatKey(keyValue)} hide={hideKey} />
    {type === 'private' && (
      <p className="rsa-key-warning">
        <T id="AccountPage.DevelopperSection.key.warning" />
      </p>
    )}
  </>
);

export default withState('hideKey', 'setHideKey', ({ hidden }) => hidden)(Key);
