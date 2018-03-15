import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from 'core/components/DropdownMenu';
import Loading from 'core/components/Loading';
import AssignAdminDropdownContainer from './AssignAdminDropdownContainer';

const AssignAdminDropdown = (props) => {
  console.log('AssignAdminDopdown');
  const { isLoading, error, styles, options } = props;
  // console.log(props);
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  return <DropdownMenu iconType="personAdd" options={options} style={styles} />;
};

AssignAdminDropdown.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default AssignAdminDropdownContainer(AssignAdminDropdown);
