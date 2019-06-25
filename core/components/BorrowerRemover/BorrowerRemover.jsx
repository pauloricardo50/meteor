// @flow
import React from 'react';
import { withProps } from 'recompose';

import { borrowerDelete } from '../../api/borrowers';
import T from '../Translation';
import ConfirmMethod from '../ConfirmMethod';
import Icon from '../Icon';

type BorrowerRemoverProps = {
  handleClick: Function,
};

const BorrowerRemover = ({
  handleClick,
  simple = false,
}: BorrowerRemoverProps) => (
  <div className="borrower-remover">
    <ConfirmMethod
      method={handleClick}
      label={!simple && <T id="BorrowerRemover.button" />}
      buttonProps={
        simple
          ? { error: true, icon: <Icon type="close" /> }
          : { error: true, outlined: true }
      }
    />
  </div>
);

export default withProps(({ borrower: { _id: borrowerId }, loanId }) => ({
  handleClick: () =>
    borrowerDelete.run({ borrowerId, loanId }).then(() => location.reload()),
}))(BorrowerRemover);
