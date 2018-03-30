import React from 'react';
import PropTypes from 'prop-types';

const AboutPage = props => (
  <div>
    Hello World
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'blue',
      }}
    >
      <div style={{ display: 'flex' }}>
        <span>Some text</span>
        <input style={{ fontSize: 20, width: '100%' }} />
      </div>

      <div style={{ display: 'flex' }}>
        <span>Some text</span>
        <input style={{ fontSize: 50, width: '100%' }} />
      </div>
    </div>
  </div>
);

AboutPage.propTypes = {};

export default AboutPage;
