import React from 'react';
import SimpleSchema from 'simpl-schema';

import { CANTONS } from '../../../../../api/loans/loanConstants';
import { RESIDENCE_TYPE } from '../../../../../api/properties/propertyConstants';
import { AutoFormDialog } from '../../../../AutoForm2/AutoFormDialog';
import DropdownMenu from '../../../../DropdownMenu';
import T from '../../../../Translation';

const getSchema = ({ residenceType }) =>
  new SimpleSchema({
    residenceType: {
      type: String,
      allowedValues: Object.values(RESIDENCE_TYPE),
      condition: () => !residenceType,
      uniforms: { placeholder: '' },
      optional: !!residenceType,
    },
    canton: {
      type: String,
      allowedValues: Object.keys(CANTONS),
      uniforms: { placeholder: '' },
    },
  });

const FinancingHeaderAdderDropdown = ({
  handleAddMaxStructure,
  isLoading,
  loan,
  openDialog,
  setDialogOpen,
}) => (
  <>
    <DropdownMenu
      iconType={isLoading ? 'loop-spin' : 'more'}
      disabled={isLoading}
      options={[
        {
          id: 'maxStructure',
          label: <T id="Financing.maxPropertyLabel" />,
          secondary: <T id="Financing.maxPropertyDescription" />,
          onClick: () => setDialogOpen(true),
        },
      ]}
    />
    <AutoFormDialog
      title={<T id="Financing.maxPropertyLabel" />}
      description={<T id="Financing.maxPropertyDialogDescription" />}
      open={openDialog}
      setOpen={setDialogOpen}
      noButton
      model={{}}
      schema={getSchema(loan)}
      onSubmit={handleAddMaxStructure}
    />
  </>
);

export default FinancingHeaderAdderDropdown;
