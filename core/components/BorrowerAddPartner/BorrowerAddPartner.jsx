import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { CIVIL_STATUS } from '../../api/borrowers/borrowerConstants';
import { addBorrower } from '../../api/methods/methodDefinitions';
import Button from '../Button';
import T from '../Translation';

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
