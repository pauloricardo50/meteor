import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import T from 'core/components/Translation';
import track from 'core/utils/analytics';
import Select from 'core/components/Select';

const handleChange = (value, toggleDrawer, history) => {
  if (value === 0) {
    track('LoanSelector - clicked on new loan', {});
    window.location.replace(`${Meteor.settings.public.subdomains.www}/start/1`);
  } else {
    track('LoanSelector - switched to loan', { loanId: value });
    toggleDrawer();
    history.push(`/loans/${value}`);
  }
};

const getOptions = (loans) => {
  const array = loans.map(({ _id: loanId, name, customName }) => ({
    id: loanId,
    label: name ? (
      <T id="LoanSelector.name" values={{ name }} />
    ) : (
      <T id="LoanSelector.empty" />
    ),
    secondary: customName,
    icon: 'home',
  }));

  return array;
};

const LoanSelector = ({
  value,
  toggleDrawer,
  history,
  currentUser: { loans },
}) => {
  const options = getOptions(loans);
  return (
    <div className="loan-selector">
      <Select
        id="loan-selector"
        value={value}
        onChange={(id, newValue) =>
          handleChange(newValue, toggleDrawer, history)
        }
        options={options}
        displayEmpty
      />
    </div>
  );
};

LoanSelector.propTypes = {
  currentUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  value: PropTypes.string,
};

LoanSelector.defaultProps = {
  value: '',
};

export default LoanSelector;
