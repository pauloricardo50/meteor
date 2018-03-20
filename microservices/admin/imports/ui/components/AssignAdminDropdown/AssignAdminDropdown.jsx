import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from 'core/components/DropdownMenu';
import { LoadingComponent } from 'core/components/Loading';
import { T } from 'core/components/Translation';
import AssignAdminDropdownContainer from './AssignAdminDropdownContainer';

const AssignAdminDropdown = (props) => {
  const { isLoading, error, styles, options } = props;
  if (isLoading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  return (
    <DropdownMenu
      iconType="personAdd"
      options={options}
      style={styles}
      tooltip={<T id="AssignAdminDropdown.assignAdmin" />}
    />
  );
};

AssignAdminDropdown.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default AssignAdminDropdownContainer(AssignAdminDropdown);
