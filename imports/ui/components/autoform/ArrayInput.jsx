import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';
import TextInput from './TextInput.jsx';
import SelectFieldInput from './SelectFieldInput.jsx';

import FormValidator from './FormValidator.jsx';

const styles = {
  button: {
    marginRight: 8,
  },
  arrayItem: {
    marginBottom: 16,
    overflow: 'unset',
  },
};

export default class ArrayInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.props.currentValue.length,
    };
  }

  getArray = () => {
    const array = [];
    const mapInput = (input, i) => {
      const props = {
        ...this.props,
        ...input,
        id: `${this.props.id}.${i}.${input.id}`,
        currentValue:
          this.props.currentValue &&
          this.props.currentValue[i] &&
          this.props.currentValue[i][input.id],
        key: input.id,
      };

      if (input.type === 'textInput') {
        return <TextInput {...props} noValidator />;
      } else if (input.type === 'selectInput') {
        return <SelectFieldInput {...props} noValidator />;
      }
    };

    for (let i = 0; i < this.state.count; i += 1) {
      // If there are multiple components per array item
      array.push(
        <div className="mask1" style={styles.arrayItem} key={i}>
          {this.props.inputs.map(input => mapInput(input, i))}
        </div>,
      );
    }

    return array;
  };

  addValue = () => {
    this.setState({ count: this.state.count + 1 });
  };

  removeValue = () => {
    // Only remove a value if there's more than 1 left
    if (this.state.count > 0) {
      const object = {};
      object[`${this.props.id}`] = 1;

      cleanMethod(this.props.popFunc, object, this.props.documentId).then(() =>
        this.setState({ count: this.state.count - 1 }),
      );
    }
  };

  render() {
    return (
      <div style={{ ...this.props.style, marginTop: 24, position: 'relative' }}>
        <label htmlFor="">
          {this.props.label}
        </label>

        {this.getArray()}
        <FormValidator {...this.props} />

        <div className="text-center">
          {this.state.count <= 0 &&
            <Button
              raised
              label={<T id="ArrayInput.add" />}
              onTouchTap={this.addValue}
              disabled={this.props.disabled}
            />}
          {this.state.count > 0 &&
            <Button
              raised
              label="-"
              onTouchTap={this.removeValue}
              style={styles.button}
              disabled={this.state.count <= 0 || this.props.disabled}
            />}
          {this.state.count > 0 &&
            <Button
              raised
              label="+"
              onTouchTap={this.addValue}
              primary
              disabled={this.props.disabled}
            />}
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
