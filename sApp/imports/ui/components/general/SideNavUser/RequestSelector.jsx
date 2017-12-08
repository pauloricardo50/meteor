import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import track from '/imports/js/helpers/analytics';
import Select from '../Select';
import Divider from '../Material/Divider';

const styles = {
  div: {
    width: '75%',
    margin: '16px 0',
  },
  dropdown: {
    width: '100%',
  },
};

const handleChange = (value, toggleDrawer, history) => {
  if (value === 0) {
    track('RequestSelector - clicked on new request', {});
    console.log('new request!');
  } else {
    track('RequestSelector - switched to request', { requestId: value });
    toggleDrawer();
    history.push(`/app/requests/${value}`);
  }
};

const getOptions = (loanRequests) => {
  const array = [];

  loanRequests.forEach(r =>
    array.push({
      id: r._id,
      label: r.name,
      icon: r.property.style === 'villa' ? 'home' : 'building',
    }),
  );

  array.push(<Divider key="divider" />);
  array.push({
    id: 0,
    label: <T id="RequestSelector.addRequest" />,
    dividerTop: true,
  });

  return array;
};

const RequestSelector = ({ value, toggleDrawer, history, loanRequests }) => (
  <div style={styles.div}>
    <Select
      id="request-selector"
      value={value}
      onChange={(id, newValue) => handleChange(newValue, toggleDrawer, history)}
      options={getOptions(loanRequests)}
      style={styles.dropdown}
    />
  </div>
);

RequestSelector.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  toggleDrawer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

RequestSelector.defaultProps = {
  loanRequests: [],
  value: '',
};

export default RequestSelector;
