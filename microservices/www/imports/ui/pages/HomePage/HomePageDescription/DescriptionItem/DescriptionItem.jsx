import React from 'react';
import PropTypes from 'prop-types';

import DescriptionItemIcon from './DescriptionItemIcon';
import DescriptionItemText from './DescriptionItemText';

const DescriptionItem = ({ step: { id }, nb }) => (
  <div className="description-item">
    <DescriptionItemText id={id} nb={nb} />
    <DescriptionItemIcon id={id} />
  </div>
);

DescriptionItem.propTypes = {
  nb: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
};

export default DescriptionItem;
