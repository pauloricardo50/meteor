import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { T } from 'core/components/Translation';
import track from 'core/utils/analytics';
import Select from 'core/components/Select';
import Divider from 'core/components/Material/Divider';

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
    track('LoanSelector - clicked on new loan', {});
    window.location.replace(`${Meteor.settings.public.subdomains.www}/start1`);
  } else {
    track('LoanSelector - switched to loan', { loanId: value });
    toggleDrawer();
    history.push(`/loans/${value}`);
  }
};

const getOptions = (loans) => {
  const array = [];

  loans.forEach(r =>
    array.push({
      id: r._id,
      label: r.name,
      icon: r.propertyId.style === 'villa' ? 'home' : 'building',
    }));

  array.push(<Divider key="divider" />);
  array.push({
    id: 0,
    label: <T id="LoanSelector.addLoan" />,
    dividerTop: true,
  });

  return array;
};

const LoanSelector = ({ value, toggleDrawer, history, loans }) => (
  <div style={styles.div}>
    <Select
      id="loan-selector"
      value={value}
      onChange={(id, newValue) => handleChange(newValue, toggleDrawer, history)}
      options={getOptions(loans)}
      style={styles.dropdown}
      displayEmpty
    />
  </div>
);

LoanSelector.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  toggleDrawer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

LoanSelector.defaultProps = {
  loans: [],
  value: '',
};

export default LoanSelector;
