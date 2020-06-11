import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import {
  propertyFormLayout,
  propertyFormSchema,
} from '../../../PropertyForm/PropertyForm';
import Select from '../../../Select';
import T from '../../../Translation';
import FinancingPropertyPickerContainer from './FinancingPropertyPickerContainer';

const useStyles = makeStyles(() => ({
  root: {
    margin: 0,
  },
}));

const FinancingPropertyPicker = ({
  options,
  value,
  handleChange,
  disabled,
  openForm,
  setOpenForm,
  handleAddProperty,
}) => {
  const classes = useStyles();

  return (
    <div className="financing-structures-property-picker propertyId">
      <Select
        value={value}
        options={options}
        onChange={handleChange}
        disabled={disabled}
        margin="dense"
        renderValue={selected => {
          const selectedOption = options.find(({ id }) => id === selected);

          return (
            selectedOption && (
              <ListItemText
                primary={selectedOption.label}
                secondary={selectedOption.description}
                classes={{ root: classes.root }}
              />
            )
          );
        }}
      />

      <AutoFormDialog
        schema={propertyFormSchema}
        layout={propertyFormLayout}
        open={openForm}
        setOpen={setOpenForm}
        title={<T id="PropertyForm.adderDialogTitle" />}
        onSubmit={handleAddProperty}
        noButton
      />
    </div>
  );
};

export default FinancingPropertyPickerContainer(FinancingPropertyPicker);
