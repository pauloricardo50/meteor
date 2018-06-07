import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import DescriptionItemNumber from './DescriptionItemNumber';

const DescriptionItemText = ({ id, nb }) => (
  <div className="description-item-text">
    <DescriptionItemNumber value={nb} />
    <b>
      <h3>
        <T id={`DescriptionItemText.${id}.title`} />
      </h3>
    </b>
    <p>
      <T id={`DescriptionItemText.${id}.description`} />
    </p>
  </div>
);

DescriptionItemText.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DescriptionItemText;
