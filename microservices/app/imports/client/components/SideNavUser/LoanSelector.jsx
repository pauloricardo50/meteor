import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import Select from 'core/components/Select';
import T from 'core/components/Translation';

const handleChange = (value, closeDrawer, history) => {
  if (value === 0) {
    window.location.replace(`${Meteor.settings.public.subdomains.www}/start/1`);
  } else {
    closeDrawer();
    history.push(`/loans/${value}`);
  }
};

const getOptions = loans => {
  const array = loans.map(
    ({ _id: loanId, name, customName, purchaseType }) => ({
      id: loanId,
      label: name ? (
        <T id="LoanSelector.name" values={{ name }} />
      ) : (
        <T id="LoanSelector.empty" />
      ),
      secondary: customName,
      icon:
        purchaseType === PURCHASE_TYPE.REFINANCING ? (
          <RefinancingIcon />
        ) : (
          <AcquisitionIcon />
        ),
    }),
  );

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
        onChange={newValue => handleChange(newValue, closeDrawer, history)}
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
