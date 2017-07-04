import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

import colors from '/imports/js/config/colors';

const FilterIcon = ({ filtered, handleFilter }) => {
  let icon;
  if (filtered && filtered.show === true) {
    icon = <Visibility color={colors.primary} />;
  } else if (filtered && filtered.show === false) {
    icon = <VisibilityOff color={colors.primary} />;
  } else {
    icon = <Visibility color={colors.lightBorder} />;
  }

  return (
    <IconButton onTouchTap={handleFilter}>
      {icon}
    </IconButton>
  );
};

FilterIcon.propTypes = {
  filtered: PropTypes.shape({
    id: PropTypes.string,
    show: PropTypes.bool,
  }),
  handleFilter: PropTypes.func.isRequired,
};

FilterIcon.defaultProps = {
  filtered: undefined,
};

export default FilterIcon;
