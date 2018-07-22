import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from 'core/components/DropdownMenu';
import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import AssignAdminDropdownContainer from './AssignAdminDropdownContainer';

const AssignAdminDropdown = (props) => {
  const { isLoading, error, styles, options } = props;
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <React.Fragment>Error: {error.reason}</React.Fragment>;
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
  styles: PropTypes.object,
  options: PropTypes.array.isRequired,
  error: PropTypes.object,
};

AssignAdminDropdown.defaultProps = {
  error: undefined,
  styles: {},
};

export default AssignAdminDropdownContainer(AssignAdminDropdown);
