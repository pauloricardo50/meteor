import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import T from 'core/components/Translation';
import track from 'core/utils/analytics';
import Select from 'core/components/Select';
import Divider from 'core/components/Material/Divider';

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
      icon: 'home',
    }));

  array.push(<Divider key="divider" />);
  array.push({
    id: 0,
    label: <T id="LoanSelector.addLoan" />,
    dividerTop: true,
  });

  return array;
};

const LoanSelector = ({
  value,
  toggleDrawer,
  history,
  currentUser: { loans },
}) => (
  <div className="loan-selector">
    <Select
      id="loan-selector"
      value={value}
      onChange={(id, newValue) => handleChange(newValue, toggleDrawer, history)}
      options={getOptions(loans)}
      displayEmpty
    />
  </div>
);

LoanSelector.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  value: PropTypes.string,
};

LoanSelector.defaultProps = {
  value: '',
};

export default LoanSelector;
