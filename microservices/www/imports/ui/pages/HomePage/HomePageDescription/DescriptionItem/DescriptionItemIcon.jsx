import React from 'react';
import PropTypes from 'prop-types';

const DescriptionItemIcon = ({ id }) => (
  <img
    className="description-item-icon"
    src={`img/homepage-${id}.svg`}
    alt=""
  />
);

DescriptionItemIcon.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DescriptionItemIcon;
