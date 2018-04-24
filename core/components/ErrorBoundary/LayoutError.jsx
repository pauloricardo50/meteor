import React from 'react';
import PropTypes from 'prop-types';

import { T } from '../Translation';
import Button from '../Button';

const LayoutError = ({ style, errorDescription, displayReloadButton }) => (
  <div className="flex-col center animated jackInTheBox" style={style}>
    <h2 className="error">
      <T id="LayoutError.title" />
    </h2>
    <div className="description">
      <p>
        <T id={`LayoutError.${errorDescription || 'description'}`} />
      </p>
    </div>
    <div className="flex center">
      {displayReloadButton && (
        <Button raised color="primary" onClick={() => location.reload()}>
          <T id="LayoutError.reload" />
        </Button>
      )}
    </div>
  </div>
);

LayoutError.propTypes = {
  style: PropTypes.object,
  errorDescription: PropTypes.string,
  displayReloadButton: PropTypes.bool,
};

LayoutError.defaultProps = {
  style: {},
  errorDescription: '',
  displayReloadButton: true,
};

export default LayoutError;
