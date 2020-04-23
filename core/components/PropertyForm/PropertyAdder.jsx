import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';
import PropertyAdderContainer from './PropertyAdderContainer';
import PropertyAdderDialog from './PropertyAdderDialog';
import PropertyReuser from './PropertyReuser';

const PropertyAdder = ({
  buttonProps = {},
  disabled,
  linkProperty,
  loanId,
  onClick,
  openModal,
  openPropertyAdder,
  reusableProperties,
  setOpenModal,
  setOpenPropertyAdder,
  triggerComponent,
  ...props
}) => (
  <>
    <PropertyReuser
      setOpenPropertyAdder={setOpenPropertyAdder}
      linkProperty={linkProperty}
      reusableProperties={reusableProperties}
      openModal={openModal}
      setOpenModal={setOpenModal}
    />
    <PropertyAdderDialog
      loanId={loanId}
      open={openPropertyAdder}
      setOpen={setOpenPropertyAdder}
      {...props}
    />
    {triggerComponent ? (
      triggerComponent({ onClick, disabled })
    ) : (
      <Button
        onClick={onClick}
        label={<T id="PropertyAdder.buttonLabel" />}
        primary
        raised
        icon={<Icon type="add" />}
        disabled={disabled}
        {...buttonProps}
      />
    )}
  </>
);

export default PropertyAdderContainer(PropertyAdder);
