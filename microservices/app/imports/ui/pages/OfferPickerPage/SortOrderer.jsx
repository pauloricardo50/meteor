import React from 'react';
import PropTypes from 'prop-types';

import colors from 'core/config/colors';
import Icon from 'core/components/Icon';
import IconButton from 'core/components/IconButton';

const SortOrderer = ({ handleChangeOrder, isAscending }) => (
  <IconButton
    type="sort"
    onClick={handleChangeOrder}
    iconProps={{
      style: {
        color: colors.primary,
        transform: isAscending ? 'scaleY(-1)' : undefined,
      },
    }}
  />
);
SortOrderer.propTypes = {
  handleChangeOrder: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
};

export default SortOrderer;
