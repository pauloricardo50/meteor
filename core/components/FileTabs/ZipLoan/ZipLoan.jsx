import React, { useContext } from 'react';
import { withProps } from 'recompose';

import { ModalManagerContext } from 'core/components/ModalManager';
import Calculator from 'core/utils/Calculator';
import Button from '../../Button';
import ZipLoanModal from './ZipLoanModal';

const ZipLoan = ({ shouldDisableButton, loan }) => {
  const disabled = shouldDisableButton();
  const { openModal } = useContext(ModalManagerContext);

  return (
    <div className="zip-loan">
      <Button
        label="Télécharger tous les documents"
        secondary
        raised
        onClick={() =>
          openModal([
            {
              title: 'Télécharger tous les documents',
              content: ({ closeModal }) => (
                <ZipLoanModal closeModal={closeModal} loan={loan} />
              ),
              actions: [],
            },
          ])
        }
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
}))(ZipLoan);
