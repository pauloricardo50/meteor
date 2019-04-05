// @flow
import React from 'react';
import { withProps } from 'recompose';

import { borrowerDelete } from '../../api/borrowers';
import T from '../Translation';
import ConfirmMethod from '../ConfirmMethod';

type BorrowerRemoverProps = {
  handleClick: Function,
};

const BorrowerRemover = ({ handleClick }: BorrowerRemoverProps) => (
  <div className="borrower-remover">
    <ConfirmMethod
      method={handleClick}
      label={<T id="BorrowerRemover.button" />}
      buttonProps={{ error: true, outlined: true }}
    />
  </div>
);

export default withProps(({ borrower: { _id: borrowerId }, loanId }) => ({
  handleClick: () =>
    borrowerDelete.run({ borrowerId, loanId }).then(() => location.reload()),
}))(BorrowerRemover);
