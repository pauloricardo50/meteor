import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button';

import { T } from '/imports/ui/components/general/Translation';
import TextInput from './TextInput';
import SelectFieldInput from './SelectFieldInput';

import FormValidator from './FormValidator';

const styles = {
  button: {
    marginRight: 8,
  },
  arrayItem: {
    marginBottom: 16,
    overflow: 'unset',
  },
};

export default class ArrayInput extends Component {
  constructor(props) {
    super(props);

    this.state = { count: this.props.currentValue.length };
  }

  getArray = () => {
    const array = [];
    const { id, currentValue, inputs } = this.props;

    const mapInput = (input, i) => {
      const { id: inputId, type, options } = input;
      const childProps = {
        ...this.props,
        ...input,
        id: `${id}.${i}.${inputId}`,
        currentValue:
          currentValue && currentValue[i] && currentValue[i][inputId],
        key: inputId,
        label: <T id={`Forms.${id}.${inputId}`} />,
        placeholder: <T id={`Forms.${id}.${inputId}.placeholder`} />,
      };

      if (type === 'textInput') {
        return <TextInput {...childProps} noValidator />;
      } else if (type === 'selectInput') {
        // Map these labels here to prevent having the id being xxx.0 or xxx.1
        // and mess up the labels in the SelectFieldInput
        childProps.options = options.map(
          o =>
            (o.id === undefined
              ? {
                id: o,
                label: <T id={`Forms.${id}.${o}`} />,
              }
              : {
                ...o,
                label: <T id={`Forms.${id}.${o.id}`} />,
              }),
        );
        return <SelectFieldInput {...childProps} noValidator />;
      }
    };

    for (let i = 0; i < this.state.count; i += 1) {
      // If there are multiple components per array item
      array.push(
        <div className="mask1" style={styles.arrayItem} key={i}>
          {inputs.map(input => mapInput(input, i))}
        </div>,
      );
    }

    return array;
  };

  addValue = () => this.setState({ count: this.state.count + 1 });

  // Only remove a value if there's more than 1 left
  removeValue = () =>
    this.state.count > 0 &&
    cleanMethod(
      this.props.popFunc,
      { [`${this.props.id}`]: 1 },
      this.props.documentId,
    ).then(() => this.setState({ count: this.state.count - 1 }));

  render() {
    const { style, label, disabled } = this.props;
    const { count } = this.state;

    return (
      <div style={{ ...style, marginTop: 24, position: 'relative' }}>
        <label htmlFor="">{label}</label>

        {this.getArray()}
        <FormValidator {...this.props} />

        <div className="text-center">
          {count <= 0 && (
            <Button
              raised
              label={<T id="ArrayInput.add" />}
              onClick={this.addValue}
              disabled={disabled}
            />
          )}
          {count > 0 && (
            <Button
              raised
              label="-"
              onClick={this.removeValue}
              style={styles.button}
              disabled={count <= 0 || disabled}
            />
          )}
          {count > 0 && (
            <Button
              raised
              label="+"
              onClick={this.addValue}
              primary
              disabled={disabled}
            />
          )}
        </div>
      </div>
    );
  }
}

ArrayInput.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.any),
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  popFunc: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
};

ArrayInput.defaultProps = {
  currentValue: [],
};
