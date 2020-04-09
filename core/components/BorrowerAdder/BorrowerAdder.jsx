import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';
import BorrowerAdderContainer from './BorrowerAdderContainer';
import BorrowerReuser from './BorrowerReuser';

const BorrowerAdder = ({
  onClick,
  openModal,
  setOpenModal,
  reusableBorrowers,
  insertBorrower,
  linkBorrower,
  isBorrower,
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
      isBorrower={isBorrower}
    />
    {TriggerComponent ? (
      React.cloneElement(TriggerComponent, { onClick, disabled })
    ) : (
      <Button
        onClick={onClick}
        label={<T id="BorrowerAdder.buttonLabel" values={{ isBorrower }} />}
        primary
        raised
        icon={<Icon type="add" />}
        disabled={disabled}
      />
    )}
  </>
);

export default BorrowerAdderContainer(BorrowerAdder);
