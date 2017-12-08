import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import { T } from '/imports/ui/components/general/Translation';

const UxText = ({ onClick }) => (
  <div className="ux-text animated fadeIn text-center">
    <div className="text">
      <h1>
        <T id="Start2Page.initialText1" />
      </h1>
      <h2>
        <small>
          <T id="Start2Page.initialText2" />
        </small>
      </h2>
    </div>
    <div>
      <Button
        raised
        label={<T id="Start2Page.initialButton" />}
        primary
        onClick={onClick}
      />
    </div>
  </div>
);

UxText.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default UxText;
