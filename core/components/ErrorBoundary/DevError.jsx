import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

const DevError = ({ error }) =>
  (Meteor.isDevelopment || Meteor.isTest ? (
    <div className="error" style={{ margin: 40 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <h4>{error.name}</h4>:
        <h3 style={{ marginLeft: 16 }}>{error.message}</h3>
      </span>
      {error.stack}
    </div>
  ) : null);

DevError.propTypes = {
  error: PropTypes.object.isRequired,
};

export default DevError;
