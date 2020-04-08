import React from 'react';
import PropTypes from 'prop-types';

import BorrowerRemover from 'core/components/BorrowerRemover';
import { BorrowerForm } from 'core/components/forms';
import Recap from 'core/components/Recap';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

import BorrowerAge from '../BorrowerAge';

const BorrowerTab = ({
  borrower,
  loan: { borrowers, _id: loanId },
  Calculator,
}) => (
  <div className="single-borrower-tab">
    <h2 className="mb-0">{borrower.name}</h2>
    <BorrowerAge borrower={borrower} />
    {borrowers && borrowers.length > 1 && (
      <BorrowerRemover borrower={borrower} loanId={loanId} />
    )}
    <Recap arrayName="borrower" borrower={borrower} Calculator={Calculator} />
    <BorrowerForm borrower={borrower} />
  </div>
);

BorrowerTab.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default withTranslationContext(({ borrower }) => ({
  gender: borrower.gender,
}))(BorrowerTab);
