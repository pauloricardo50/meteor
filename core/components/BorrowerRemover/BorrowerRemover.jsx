// @flow
import React from 'react';
import { withProps } from 'recompose';

import { borrowerDelete } from '../../api/borrowers';
import Button from '../Button';
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
      keyword={false}
    />
  </div>
);

export default withProps(({ borrower: { _id: borrowerId } }) => ({
  handleClick: () =>
    borrowerDelete.run({ borrowerId }).then(() => location.reload()),
}))(BorrowerRemover);
