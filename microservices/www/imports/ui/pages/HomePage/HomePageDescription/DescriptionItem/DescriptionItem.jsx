import React from 'react';
import PropTypes from 'prop-types';

import DescriptionItemText from './DescriptionItemText';
import DescriptionItemIcon from './DescriptionItemIcon';

const DescriptionItem = ({ step: { id }, nb }) => (
  <div className="description-item">
    <DescriptionItemText id={id} nb={nb} />
    <DescriptionItemIcon id={id} />
  </div>
);

DescriptionItem.propTypes = {
  step: PropTypes.object.isRequired,
  nb: PropTypes.number.isRequired,
};

export default DescriptionItem;
