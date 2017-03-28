import React, { PropTypes } from 'react';

import TextInput from './TextInput.jsx';
import RadioInput from './RadioInput.jsx';
import SelectFieldInput from './SelectFieldInput.jsx';
import ConditionalInput from './ConditionalInput.jsx';
import DateInput from './DateInput.jsx';
import DropzoneInput from './DropzoneInput.jsx';
import DropzoneArray from '../general/DropzoneArray.jsx';
import ArrayInput from './ArrayInput.jsx';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 40,
  },
  smallWidth: {
    width: '100%',
    maxWidth: 400,
  },
  mediumWidth: {
    width: '100%',
    maxWidth: 600,
  },
  fullWidth: {
    width: '100%',
  },
};

const inputSwitch = (singleInput, index, parentProps) => {
  const props = {
    ...singleInput,
    ...parentProps,
    key: index,
    style: parentProps.fullWidth ? styles.fullWidth : styles.smallWidth,
  };

  // Prevent undefined showCondition to trigger as well
  if (singleInput.showCondition === false) {
    return null;
  }

  switch (singleInput.type) {
    case 'TextInput':
      return <TextInput multiLine={false} {...props} />;
    case 'TextInputLarge':
      return <TextInput multiLine {...props} style={styles.mediumWidth} />;
    case 'TextInputNumber':
      return <TextInput number {...props} />;
    case 'TextInputMoney':
      return <TextInput money {...props} />;
    case 'RadioInput':
      return <RadioInput {...props} />;
    case 'SelectFieldInput':
      return <SelectFieldInput {...props} />;
    case 'ConditionalInput':
      return (
        <ConditionalInput
          conditionalTrueValue={singleInput.conditionalTrueValue}
          key={index}
        >
          {inputSwitch(singleInput.inputs[0], 0, parentProps)}
          {singleInput.inputs
            .slice(1)
            .map((input, i) => inputSwitch(input, i, parentProps))}
        </ConditionalInput>
      );
    case 'h3':
      return <h3 style={styles.subtitle} key={index}>{singleInput.text}</h3>;
    case 'h2':
      return <h2 style={styles.subtitle} key={index}>{singleInput.text}</h2>;
    case 'Space':
      return (
        <div style={{ width: '100%', height: singleInput.height }} key={index}>
          {singleInput.text}
        </div>
      );
    case 'DateInput':
      return <DateInput {...props} />;
    case 'DropzoneInput':
      return (
        // <DropzoneInput
        //   {...singleInput}
        //   {...extraValues}
        //   key={index}
        // />
        <DropzoneArray {...props} />
      );
    case 'ArrayInput':
      return <ArrayInput {...props} />;
    default:
      throw new Error('Not a valid AutoForm type');
  }
};

const AutoForm = props => (
  <div className={props.formClasses}>
    <form style={styles.form} onSubmit={e => e.preventDefault()}>
      {props.inputs.map((input, i) => inputSwitch(input, i, props))}
    </form>
  </div>
);

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  fullWidth: PropTypes.bool,
  documentId: PropTypes.string.isRequired,
  updateFunc: PropTypes.string,
  pushFunc: PropTypes.string,
  popFunc: PropTypes.string,
};

AutoForm.defaultProps = {
  loanRequest: {},
  borrowers: [],
  fullWidth: false,
  updateFunc: 'updateRequest',
  pushFunc: 'pushRequestValue',
  popFunc: 'popRequestValue',
};

export default AutoForm;
