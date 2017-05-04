import React from 'react';
import { FormattedMessage } from 'react-intl';

const Component = () => (
  <main id="home">
    <h1 className="ui header">
      <FormattedMessage
        id="info.unsupportedBrowser"
        defaultMessage="Your browser is not supported"
      />
    </h1>
  </main>
);
export default Component;
