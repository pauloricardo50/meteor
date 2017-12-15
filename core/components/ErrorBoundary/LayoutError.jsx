import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Button from '/imports/ui/components/general/Button';

const LayoutError = ({ style }) => (
  <div className="flex-col center animated jackInTheBox" style={style}>
    <h2 className="error">
      <T id="LayoutError.title" />
    </h2>
    <div className="description">
      <p>
        <T id="LayoutError.description" />
      </p>
    </div>
    <div className="flex center">
      <Button raised color="primary" onClick={() => location.reload()}>
        <T id="LayoutError.reload" />
      </Button>
    </div>
  </div>
);

LayoutError.propTypes = {
  style: PropTypes.object,
};

LayoutError.defaultProps = {
  style: {},
};

export default LayoutError;
