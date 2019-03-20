// @flow
import React from 'react';

import Key from './Key';

type KeysProps = {
  keyPair: Object,
};

const Keys = ({ keyPair = {} }: KeysProps) => {
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
      <Key
        keyValue={publicKey}
        createdAt={createdAt}
        type="public"
        hidden={!privateKey}
        key={publicKey}
      />
      {privateKey && (
        <Key
          keyValue={privateKey}
          createdAt={createdAt}
          type="private"
          hidden={false}
          key="private"
        />
      )}
    </>
  );
};

export default Keys;
