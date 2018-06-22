import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from 'core/components/DropdownSelect';
import T from 'core/components/Translation';

import DetailSideNavFiltersContainer from './DetailSideNavFiltersContainer';

// TODO: put logic in container
const DetailSideNavFilters = ({ onChange, currentUser }) => {
  const currentUserEmail = currentUser.emails[0].address;

  const handleChange = (selectedOptions) => {
    const selectedFilters = selectedOptions
      .map(({ value }) => value)
      .filter(value => value);
    const filters = { $and: selectedFilters };

    onChange(filters);
  };

  const filteringOptions = [
    {
      label: <T id="DetailSideNavFilters.showAssignedToMe" />,
      value: {
        $or: [
          {
            'user.assignedEmployee.emails': {
              $elemMatch: { address: currentUserEmail },
            },
          },
          {
            'assignedEmployee.emails': {
              $elemMatch: { address: currentUserEmail },
            },
          },
        ],
      },
    },
  ];

  return (
    <DropdownSelect
      options={filteringOptions}
      onChange={handleChange}
      iconType="filter"
      tooltip={<T id="general.filterBy" />}
    />
  );
};

DetailSideNavFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default DetailSideNavFiltersContainer(DetailSideNavFilters);
