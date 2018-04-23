import React from 'react';
import PropTypes from 'prop-types';

import { T } from '../Translation';
import Select from '../Select';
import SortOrderer from './SortOrderer';

const OfferListSorting = ({
  sort,
  options,
  handleChange,
  handleChangeOrder,
  isAscending,
}) => (
  <div className="flex" style={{ marginBottom: 16, width: '100%' }}>
    <Select
      id="sort"
      label={<T id="general.sortBy" />}
      value={sort}
      onChange={handleChange}
      options={options}
    />
    <SortOrderer
      handleChangeOrder={handleChangeOrder}
      isAscending={isAscending}
    />
  </div>
);

OfferListSorting.propTypes = {
  sort: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
};

export default OfferListSorting;
