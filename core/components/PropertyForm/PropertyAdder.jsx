import React from 'react';
import { withProps } from 'recompose';

import { propertyInsert } from '../../api/properties/methodDefinitions';
import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';
import PropertyAdderContainer from './PropertyAdderContainer';
import PropertyForm from './PropertyForm';
import PropertyReuser from './PropertyReuser';

const PropertyAdderDialog = withProps(
  ({
    loanId,
    propertyUserId,
    category,
    onSubmitSuccess = x => x,
    setOpen,
    ...rest
  }) => ({
    onSubmit: property =>
      propertyInsert
        .run({
          property: { category, ...property },
          loanId,
          userId: propertyUserId,
        })
        .then(onSubmitSuccess)
        .finally(() => setOpen(false)),
    form: 'add-property',
    formTitleId: 'PropertyForm.adderDialogTitle',
    formDescriptionId: 'PropertyForm.adderDialogDescription',
    noButton: true,
    setOpen,
    onSubmitSuccess: x => x,
    ...rest,
  }),
)(PropertyForm);

const PropertyAdder = ({
  onClick,
  openModal,
  setOpenModal,
  reusableProperties,
  linkProperty,
  setOpenPropertyAdder,
  openPropertyAdder,
  TriggerComponent,
  disabled,
  loanId,
  schema,
  buttonProps = {},
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
      schema={schema}
      open={openPropertyAdder}
      setOpen={setOpenPropertyAdder}
      {...props}
    />
    {TriggerComponent ? (
      React.cloneElement(TriggerComponent, { onClick, disabled })
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
