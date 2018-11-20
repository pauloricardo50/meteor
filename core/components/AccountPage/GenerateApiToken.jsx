// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import Button from '../Button';
import { generateApiToken } from '../../api';

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
    {apiToken && <p>{apiToken}</p>}
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
      setLoading(true);
      generateApiToken.run({ userId }).then(() => setLoading(false));
    },
  })),
)(GenerateApiToken);
