// @flow
import React from 'react';
import { withProps } from 'recompose';

import { getZipLoanUrl } from 'core/api/methods/index';
import Calculator from 'core/utils/Calculator';
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
        tooltip={
          disabled
            ? "Il manque des informations: il faut un nom et un prénom sur chaque emprunteur, ainsi qu'une addresse sur le bien immobilier."
            : undefined
        }
      />
    </div>
  );
};

export default withProps(({ loan }) => ({
  shouldDisableButton: () => {
    const { borrowers = [] } = loan;
    if (!borrowers.every(({ firstName, lastName }) => firstName && lastName)) {
      return true;
    }

    if (
      !Calculator.selectPropertyKey({
        loan,
        key: 'address1',
      })
    ) {
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
