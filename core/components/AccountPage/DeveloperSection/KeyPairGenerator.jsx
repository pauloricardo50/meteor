import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { generateApiKeyPair } from '../../../api/users/methodDefinitions';
import Button from '../../Button';
import T from '../../Translation';

const KeyPairGenerator = ({ loading, generateKeyPair, keyPair = {} }) => (
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
