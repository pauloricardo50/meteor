import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';

const BorrowerTab = ({ borrower }) => (
  <div className="mask1">
    <h2>
      {borrower.firstName} {borrower.lastName}
    </h2>

    <Recap arrayName="borrower" borrower={borrower} />
  </div>
);

BorrowerTab.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default BorrowerTab;
