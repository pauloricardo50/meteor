// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';

import Button from 'core/components/Button';
import { generateApiToken } from 'core/api';

type GenerateApiTokenProps = {
  user: Object,
  generateToken: Function,
  loading: Boolean,
};

const GenerateApiToken = ({
  user: { apiToken },
  generateToken,
  loading,
}: GenerateApiTokenProps) => (
  <div className="api-token-generator">
    <h4>Clé API</h4>
    {apiToken && <p id="apiToken">{apiToken}</p>}
    <Button onClick={generateToken} loading={loading} primary>
      Générer
    </Button>
  </div>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ user: { _id: userId }, setLoading }) => ({
    generateToken: (event) => {
      event.preventDefault();
      const confirm = window.alert('Êtes-vous sûr de vouloir regénérer une clé API ?');
      if (confirm) {
        setLoading(true);
        return generateApiToken.run({ userId }).then(() => setLoading(false));
      }

      return Promise.resolve();
    },
  })),
)(GenerateApiToken);
