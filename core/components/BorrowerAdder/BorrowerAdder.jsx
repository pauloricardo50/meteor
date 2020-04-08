import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import BorrowerAdderContainer from './BorrowerAdderContainer';
import BorrowerReuser from './BorrowerReuser';

const BorrowerAdder = ({
  onClick,
  openModal,
  setOpenModal,
  reusableBorrowers,
  insertBorrower,
  linkBorrower,
  borrowerLabel,
  TriggerComponent,
  disabled,
}) => (
  <>
    <BorrowerReuser
      insertBorrower={insertBorrower}
      linkBorrower={linkBorrower}
      reusableBorrowers={reusableBorrowers}
      openModal={openModal}
      setOpenModal={setOpenModal}
      borrowerLabel={borrowerLabel}
    />
    {TriggerComponent ? (
      React.cloneElement(TriggerComponent, { onClick, disabled })
    ) : (
      <Button
        onClick={onClick}
        label={
          borrowerLabel.charAt(0).toUpperCase() + borrowerLabel.substring(1)
        }
        primary
        raised
        icon={<Icon type="add" />}
        disabled={disabled}
      />
    )}
  </>
);

export default BorrowerAdderContainer(BorrowerAdder);
