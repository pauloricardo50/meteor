// @flow
import React from 'react';
import { withProps } from 'recompose';

import { getZipLoanUrl } from 'core/api/methods/index';
import Button from '../Button';

type ZipLoanProps = {
  loan: Object,
  downloadZip: Function,
  shouldDisableButton: Function,
};

const ZipLoan = ({ downloadZip, shouldDisableButton }: ZipLoanProps) => {
  const disabled = shouldDisableButton();

  return (
    <div className="zip-loan">
      <Button
        label="Télécharger tous les documents"
        secondary
        raised
        onClick={downloadZip}
        disabled={disabled}
        tooltip={disabled ? 'Il manque des informations' : undefined}
      />
    </div>
  );
};

export default withProps(({ loan }) => ({
  shouldDisableButton: () => {
    const { borrowers = [], structure } = loan;
    if (!borrowers.every(({ firstName, lastName }) => firstName && lastName)) {
      return true;
    }

    if (structure.property && !structure.property.address1) {
      return true;
    }
    return false;
  },
  downloadZip: () => {
    getZipLoanUrl.run({ loanId: loan._id }).then((url) => {
      window.open(url);
    });
  },
}))(ZipLoan);
