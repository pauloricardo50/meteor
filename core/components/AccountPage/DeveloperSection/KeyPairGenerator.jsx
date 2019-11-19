// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';

import Button from 'core/components/Button';
import { generateApiKeyPair } from 'core/api';
import T from 'core/components/Translation';

type KeyPairGeneratorProps = {
  loading: boolean,
  generateKeyPair: Function,
  keyPair: Object,
};

const KeyPairGenerator = ({
  loading,
  generateKeyPair,
  keyPair = {},
}: KeyPairGeneratorProps) => (
  <Button
    onClick={generateKeyPair}
    loading={loading}
    primary
    raised={!keyPair.publicKey}
    className="generate-key-pair"
  >
    {keyPair.publicKey ? (
      <T id="AccountPage.DevelopperSection.keyPair.regenerate" />
    ) : (
      <T id="AccountPage.DevelopperSection.keyPair.generate" />
    )}
  </Button>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(
    ({
      user: { _id: userId },
      setLoading,
      setKeyPair,
      keyPair: { publicKey },
    }) => ({
      generateKeyPair: event => {
        event.preventDefault();
        const confirm =
          !publicKey ||
          window.confirm(
            "Êtes-vous sûr de vouloir regénérer une nouvelle paire de clé API ? L'ancienne paire de clés sera immédiatement annulée.",
          );
        if (confirm) {
          setLoading(true);
          return generateApiKeyPair
            .run({ userId })
            .then(setKeyPair)
            .finally(() => setLoading(false));
        }

        return Promise.resolve();
      },
    }),
  ),
)(KeyPairGenerator);
