import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import T from 'core/components/Translation';
import Select from 'core/components/Select';

const handleChange = (value, closeDrawer, history) => {
  if (value === 0) {
    window.location.replace(`${Meteor.settings.public.subdomains.www}/start/1`);
  } else {
    closeDrawer();
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
  closeDrawer,
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
          handleChange(newValue, closeDrawer, history)
        }
        options={options}
        displayEmpty
      />
    </div>
  );
};

LoanSelector.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  value: PropTypes.string,
};

LoanSelector.defaultProps = {
  value: '',
};

export default LoanSelector;
