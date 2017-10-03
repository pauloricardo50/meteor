import React from 'react';
import PropTypes from 'prop-types';

const RootError = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <h2 style={{ color: 'red' }}>Woops, there was an error</h2>
    <p style={{ padding: 40 }}>
      You can try to reload the page to fix it, or else reach out to
      florian@e-potek.ch
    </p>
    <button onClick={() => location.reload()}>Reload the page</button>
  </div>
);

RootError.propTypes = {};

export default RootError;
