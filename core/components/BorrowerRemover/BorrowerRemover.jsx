// @flow
import React from 'react';
import { withProps } from 'recompose';

import { borrowerDelete } from '../../api/borrowers';
import Button from '../Button';
import T from '../Translation/Translation';

type BorrowerRemoverProps = {
  handleClick: Function,
};

const BorrowerRemover = ({ handleClick }: BorrowerRemoverProps) => (
  <div className="borrower-remover">
    <Button onClick={handleClick} primary>
      <T id="BorrowerRemover.button" />
    </Button>
  </div>
);

export default withProps(({ borrower: { _id: borrowerId } }) => ({
  handleClick: event => borrowerDelete.run({ borrowerId }),
}))(BorrowerRemover);
