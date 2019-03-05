// @flow
import React from 'react';
import { withState } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-light-svg-icons/faKey';
import moment from 'moment';

import message from 'core/utils/message';
import Button from 'core/components/Button';
import RsaKey from './RsaKey';

const KEY_TYPES = {
  public: 'publique',
  private: 'privée',
};

type KeyPairProps = {
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
  message.success('Clé copiée dans le presse-papier !');
};

const KeyPair = ({
  keyValue,
  createdAt,
  type,
  hideKey,
  setHideKey,
}: KeyPairProps) => (
  <div className="key-pair">
    <div className="key">
      <FontAwesomeIcon icon={faKey} className={`solid icon ${type}-key-icon`} />
      <div className="key-infos">
        <h4>
          Clé {KEY_TYPES[type]}
          <Button onClick={() => setHideKey(!hideKey)} primary>
            {hideKey ? 'Afficher la clé' : 'Masquer la clé'}
          </Button>
          <Button onClick={() => copyKeyToClipboard(keyValue)} primary>
            Copier la clé
          </Button>
        </h4>
        <p className="secondary">
          Générée le {moment(createdAt).format('DD MMM YYYY')}
        </p>
      </div>
    </div>
    <RsaKey keyValue={keyValue} hide={hideKey} />
    {type === 'private' && (
      <p className="rsa-key-warning">
        Sauvegardez votre clé privée maintenant: vous ne pourrez plus y accéder
        !
      </p>
    )}
  </div>
);

export default withState('hideKey', 'setHideKey', ({ hidden }) => hidden)(KeyPair);
