// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import cx from 'classnames';

import Button from 'core/components/Button';
import { generateApiKeyPair } from 'core/api';
import KeyPair from './KeyPair';

type GenerateApiKeyPairProps = {
  generateKeyPair: Function,
  loading: Boolean,
  keyPair: Object,
};

const getContent = ({ keyPair = {} }) => {
  const { publicKey, privateKey, createdAt } = keyPair;
  if (!publicKey) {
    return (
      <>
        <h3>Pas de clés API</h3>
        <h4 className="secondary">
          Vous pouvez générer une paire de clés pour commencer à utiliser notre
          API REST.
        </h4>
      </>
    );
  }

  return (
    <>
      <KeyPair
        keyValue={publicKey}
        createdAt={createdAt}
        type="public"
        hidden={!privateKey}
        key={publicKey}
      />
      {privateKey && (
        <KeyPair
          keyValue={privateKey}
          createdAt={createdAt}
          type="private"
          hidden={false}
          key="private"
        />
      )}
    </>
  );

  //   return (
  //     <>
  //       <h3>Clés API</h3>
  //       <h4>Clé publique</h4>
  //       <textarea className="rsa-key" value={publicKey} disabled />
  //       {privateKey && (
  //         <>
  //           <h4>Clé privée</h4>
  //           <textarea className="rsa-key" value={privateKey} disabled />
  //           <p className="rsa-key-warning">
  //             Sauvegardez votre clé privée maintenant: vous ne pourrez plus y
  //             accéder !
  //           </p>
  //         </>
  //       )}
  //     </>
  //   );
};

const GenerateApiKeyPair = ({
  keyPair = {},
  generateKeyPair,
  loading,
}: GenerateApiKeyPairProps) => (
  <div className="api-keyPair-generator">
    <div
      className={cx('card1 flex-col', {
        'empty-state': !keyPair.publicKey,
        center: !keyPair.publicKey,
      })}
    >
      {getContent({ keyPair })}
      <Button
        onClick={generateKeyPair}
        loading={loading}
        primary
        raised={!keyPair.publicKey}
        className="generate-key-pair"
      >
        {keyPair.publicKey
          ? 'Regénérer une paire de clés'
          : 'Générer une paire de clés'}
      </Button>
    </div>
  </div>
);

export default compose(
  withState('loading', 'setLoading', false),
  withState(
    'keyPair',
    'setKeyPair',
    ({ user: { apiPublicKey: { publicKey, createdAt } = {} } }) => ({
      publicKey,
      createdAt,
    }),
  ),
  withProps(({
    user: { _id: userId },
    setLoading,
    setKeyPair,
    keyPair: { publicKey },
  }) => ({
    generateKeyPair: (event) => {
      event.preventDefault();
      const confirm = !publicKey
          || window.confirm("Êtes-vous sûr de vouloir regénérer une nouvelle paire de clé API ? L'ancienne paire de clés sera immédiatement annulée.");
      if (confirm) {
        setLoading(true);
        return generateApiKeyPair
          .run({ userId })
          .then(setKeyPair)
          .finally(() => setLoading(false));
      }

      return Promise.resolve();
    },
  })),
)(GenerateApiKeyPair);
