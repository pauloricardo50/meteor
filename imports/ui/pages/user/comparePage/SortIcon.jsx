import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import MuiSortIcon from 'material-ui/svg-icons/content/sort';
import colors from '/imports/js/config/colors';

const SortIcon = ({ sorted, handleSort }) => {
  let icon;
  if (sorted && sorted.ascending === true) {
    icon = <MuiSortIcon color={colors.primary} className="flip-rotate-270" />;
  } else if (sorted && sorted.ascending === false) {
    icon = <MuiSortIcon color={colors.primary} className="rotate-270" />;
  } else {
    icon = <MuiSortIcon className="flip-rotate-270" />;
  }

  return (
    <IconButton onTouchTap={handleSort}>
      {icon}
    </IconButton>
  );
};

SortIcon.propTypes = {
  sorted: PropTypes.shape({
    id: PropTypes.string,
    ascending: PropTypes.bool,
  }),
  handleSort: PropTypes.func.isRequired,
};

SortIcon.defaultProps = {
  sorted: undefined,
};

export default SortIcon;
