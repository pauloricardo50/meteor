import React from 'react';
import PropTypes from 'prop-types';

import colors from 'core/config/colors';
import Icon from 'core/components/Icon';

const SortIcon = ({ sorted }) => {
  if (sorted && sorted.ascending === true) {
    return (
      <Icon type="sort" color={colors.primary} className="flip-rotate-270" />
    );
  } else if (sorted && sorted.ascending === false) {
    return <Icon type="sort" color={colors.primary} className="rotate-270" />;
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
