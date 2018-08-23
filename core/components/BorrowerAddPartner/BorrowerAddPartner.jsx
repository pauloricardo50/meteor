// @flow
// @flow
import React from 'react';
import { withProps, withState, compose } from 'recompose';

import RadioButtons from 'core/components/RadioButtons';
import { addBorrower } from 'core/api';
import T from '../Translation';
import Button from '../Button';
import { CIVIL_STATUS } from '../../api/constants';

type BorrowerAddPartnerProps = {
  handleClick: Function,
  isLoading: boolean,
};

const BorrowerAddPartner = ({
  handleClick,
  isLoading,
}: BorrowerAddPartnerProps) => (
  <div className="borrower-add-partner">
    <Button
      onClick={handleClick}
      primary
      variant="outlined"
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
