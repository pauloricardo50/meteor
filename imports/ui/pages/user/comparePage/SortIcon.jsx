import React from 'react';
import PropTypes from 'prop-types';

import MuiSortIcon from 'material-ui/svg-icons/content/sort';
import colors from '/imports/js/config/colors';

const SortIcon = ({ sorted }) => {
  if (sorted && sorted.ascending === true) {
    return <MuiSortIcon color={colors.primary} className="flip-rotate-270" />;
  } else if (sorted && sorted.ascending === false) {
    return <MuiSortIcon color={colors.primary} className="rotate-270" />;
  }
  return null;
};

SortIcon.propTypes = {
  sorted: PropTypes.shape({
    id: PropTypes.string,
    ascending: PropTypes.bool,
  }),
};

SortIcon.defaultProps = {
  sorted: undefined,
};

export default SortIcon;
