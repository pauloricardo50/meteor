import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import AppItem from './AppItem';

const LoanAppItem = ({ loan }) => (
  <AppItem
    key={loan._id}
    title={loan.name || <T id="AppPage.noName" />}
    subtitle={<T id="AppPage.loan" />}
    mainText={<T id={`steps.${loan.logic.step}`} />}
    href={`/loans/${loan._id}`}
  />
);

LoanAppItem.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default LoanAppItem;
