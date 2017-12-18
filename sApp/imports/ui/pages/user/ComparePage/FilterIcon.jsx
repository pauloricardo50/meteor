import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

import colors from '/imports/js/config/colors';

const FilterIcon = ({ filtered }) => {
  if (filtered && filtered.show === true) {
    return <Icon type="eye" color={colors.primary} />;
  } else if (filtered && filtered.show === false) {
    return <Icon type="eyeCrossed" color={colors.primary} />;
  }
  return null;
};

FilterIcon.propTypes = {
  filtered: PropTypes.shape({
    id: PropTypes.string,
    show: PropTypes.bool,
  }),
};

FilterIcon.defaultProps = {
  filtered: undefined,
};

export default FilterIcon;
