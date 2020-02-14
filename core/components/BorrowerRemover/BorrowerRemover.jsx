import React from 'react';
import { withProps } from 'recompose';

import { borrowerDelete } from '../../api/borrowers';
import T from '../Translation';
import ConfirmMethod from '../ConfirmMethod';
import Icon from '../Icon';

const BorrowerRemover = ({ handleClick, simple = false, buttonProps }) => (
  <div className="borrower-remover">
    <ConfirmMethod
      method={handleClick}
      label={!simple && <T id="BorrowerRemover.button" />}
      buttonProps={
        simple
          ? { error: true, icon: <Icon type="close" />, ...buttonProps }
          : { error: true, outlined: true, ...buttonProps }
      }
    />
  </div>
);

export default withProps(
  ({ borrower: { _id: borrowerId }, loanId, noReload = false }) => ({
    handleClick: () =>
      borrowerDelete
        .run({ borrowerId, loanId })
        .then(() => (noReload ? Promise.resolve() : location.reload())),
  }),
)(BorrowerRemover);
