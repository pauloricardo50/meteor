import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { BorrowerForm } from 'core/components/forms';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import BorrowerRemover from 'core/components/BorrowerRemover';

const BorrowerTab = ({ borrower, loan: { borrowers } }) => (
  <div className="single-borrower-tab">
    <h2>{borrower.name}</h2>
    {borrowers && borrowers.length > 1 && (
      <BorrowerRemover borrower={borrower} />
    )}
    <Recap arrayName="borrower" borrower={borrower} />
    <BorrowerForm borrower={borrower} />
  </div>
);

BorrowerTab.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default withTranslationContext(({ borrower }) => ({
  gender: borrower.gender,
}))(BorrowerTab);
