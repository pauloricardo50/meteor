import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const LayoutError = () => (
  <div className="flex-col center">
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

LayoutError.propTypes = {};

export default LayoutError;
