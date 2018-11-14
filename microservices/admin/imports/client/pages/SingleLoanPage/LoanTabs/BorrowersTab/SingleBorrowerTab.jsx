import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { BorrowerForm } from 'core/components/forms';

const BorrowerTab = ({ borrower }) => (
  <div className="single-borrower-tab">
    <h2>{borrower.name}</h2>
    <Recap arrayName="borrower" borrower={borrower} />
    <BorrowerForm borrower={borrower} />
  </div>
);

BorrowerTab.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default BorrowerTab;
