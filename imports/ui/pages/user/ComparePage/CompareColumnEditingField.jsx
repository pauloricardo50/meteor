import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '/imports/ui/components/general/TextInput';
import DatePicker from '/imports/ui/components/general/DatePicker';
import RadioButtons from '/imports/ui/components/general/RadioButtons';

const styles = {
  field: {
    width: '100%',
  },
};

const CompareColumnEditingField = (props) => {
  const { field, property, parentState, handleChange } = props;
  let value;

  if (field.custom) {
    value = property.fields[field.id];
  } else {
    value = property[field.id];
  }

  switch (field.type) {
    case 'number':
      return (
        <TextInput
          currentValue={parentState[field.id]}
          id={field.id}
          type="number"
          handleChange={handleChange}
        />
      );
    case 'money':
      return (
        <TextInput
          currentValue={parentState[field.id]}
          id={field.id}
          type="money"
          handleChange={handleChange}
        />
      );
    case 'date':
      return (
        <DatePicker
          currentValue={parentState[field.id]}
          id={field.id}
          handleChange={handleChange}
          style={styles.field}
        />
      );
    case 'boolean':
      return (
        <RadioButtons
          currentValue={parentState[field.id]}
          id={field.id}
          handleChange={handleChange}
          options={[true, false]}
          intlPrefix="CompareColumn.boolean"
          style={{ width: '100%' }}
        />
      );
    case 'percent':
      return (
        <TextInput
          currentValue={parentState[field.id]}
          id={field.id}
          type="percent"
          handleChange={handleChange}
        />
      );
    case 'text':
      return (
        <TextInput
          currentValue={parentState[field.id]}
          id={field.id}
          handleChange={handleChange}
        />
      );
    default:
      return (
        <span>
          {value}
        </span>
      );
  }
};

CompareColumnEditingField.propTypes = {
  field: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  parentState: PropTypes.object.isRequired,
};

export default CompareColumnEditingField;
