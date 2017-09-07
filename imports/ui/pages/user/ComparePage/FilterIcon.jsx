import React from 'react';
import PropTypes from 'prop-types';

import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

import colors from '/imports/js/config/colors';

const FilterIcon = ({ filtered }) => {
  if (filtered && filtered.show === true) {
    return <Visibility color={colors.primary} />;
  } else if (filtered && filtered.show === false) {
    return <VisibilityOff color={colors.primary} />;
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
