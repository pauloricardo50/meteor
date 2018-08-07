import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';
import AssignAdminDropdownContainer from './AssignAdminDropdownContainer';

const AssignAdminDropdown = (props) => {
  const { error, styles, options } = props;
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
  styles: PropTypes.object,
  options: PropTypes.array.isRequired,
  error: PropTypes.object,
};

AssignAdminDropdown.defaultProps = {
  error: undefined,
  styles: {},
};

export default AssignAdminDropdownContainer(AssignAdminDropdown);
