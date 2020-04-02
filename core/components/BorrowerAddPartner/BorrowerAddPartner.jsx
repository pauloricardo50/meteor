import React from 'react';
import { withProps, withState, compose } from 'recompose';

import { addBorrower } from '../../api/methods';
import T from '../Translation';
import Button from '../Button';
import { CIVIL_STATUS } from '../../api/borrowers/borrowerConstants';

const BorrowerAddPartner = ({ handleClick, isLoading }) => (
  <div className="borrower-add-partner">
    <Button
      onClick={handleClick}
      primary
      outlined
      label={<T id="BorrowerAddPartner.label" />}
      loading={isLoading}
    />
  </div>
);

export default compose(
  withState('isLoading', 'setLoading', false),
  withProps(({ loanId, setLoading }) => ({
    handleClick: () => {
      setLoading(true);
      addBorrower
        .run({
          loanId,
          borrower: { sameAddress: true, civilStatus: CIVIL_STATUS.MARRIED },
        })
        .finally(() => setLoading(false));
    },
  })),
)(BorrowerAddPartner);
