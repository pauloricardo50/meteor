import React from 'react';
import PropTypes from 'prop-types';

import TextInput from 'core/components/TextInput';
import DateInput from '/imports/ui/components/general/DateInput';
import RadioButtons from '/imports/ui/components/general/RadioButtons';

const styles = {
  field: {
    width: '100%',
  },
};

const CompareColumnEditingField = (props) => {
  const { field, property, parentState, onChange } = props;
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
          value={parentState[field.id]}
          id={field.id}
          type="number"
          onChange={onChange}
        />
      );
    case 'money':
      return (
        <TextInput
          value={parentState[field.id]}
          id={field.id}
          type="money"
          onChange={onChange}
        />
      );
    case 'date':
      return (
        <DateInput
          value={parentState[field.id]}
          id={field.id}
          onChange={(newDate, id) => onChange(id, newDate)}
          style={styles.field}
          // withPortal
          datePickerProps={{
            withPortal: true,
          }}
          // withFullScreenPortal
        />
      );
    case 'boolean':
      return (
        <RadioButtons
          value={parentState[field.id]}
          id={field.id}
          onChange={onChange}
          options={[true, false]}
          intlPrefix="CompareColumn.boolean"
          style={{ width: '100%' }}
        />
      );
    case 'percent':
      return (
        <TextInput
          value={parentState[field.id]}
          id={field.id}
          type="percent"
          onChange={onChange}
        />
      );
    case 'text':
      return (
        <TextInput
          value={parentState[field.id]}
          id={field.id}
          onChange={onChange}
        />
      );
    default:
      return <span>{value}</span>;
  }
};

CompareColumnEditingField.propTypes = {
  field: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  parentState: PropTypes.object.isRequired,
};

export default CompareColumnEditingField;
