import React from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import Button from '../Button';
import DevError from './DevError';

const LayoutError = ({ style, error }) => (
  <div className="flex-col center animated jackInTheBox" style={style}>
    <h2 className="error">
      <T id="LayoutError.title" />
    </h2>
    <div className="description">
      <p>
        <T id="LayoutError.description" />
      </p>
    </div>
    <DevError error={error} />
    <div className="flex center">
      <Button raised color="primary" onClick={() => location.reload()}>
        <T id="LayoutError.reload" />
      </Button>
      <a href="/" className="home-link">
        <Button raised color="secondary">
          <T id="LayoutError.redirectHome" />
        </Button>
      </a>
    </div>
  </div>
);

LayoutError.propTypes = {
  error: PropTypes.object.isRequired,
  style: PropTypes.object,
};

LayoutError.defaultProps = {
  style: {},
};

export default LayoutError;
