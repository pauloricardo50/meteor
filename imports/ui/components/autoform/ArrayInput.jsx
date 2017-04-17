import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';

import TextInput from './TextInput.jsx';
import RadioInput from './RadioInput.jsx';
import SelectFieldInput from './SelectFieldInput.jsx';
import ConditionalInput from './ConditionalInput.jsx';
import DateInput from './DateInput.jsx';
import DropzoneInput from './DropzoneInput.jsx';
import DropzoneArray from '../general/DropzoneArray.jsx';

const styles = {
  button: {
    marginRight: 8,
  },
};

export default class ArrayInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.props.currentValue.length,
    };

    this.removeValue = this.removeValue.bind(this);
    this.addValue = this.addValue.bind(this);
    this.getArray = this.getArray.bind(this);
  }

  removeValue() {
    // Only remove a value if there's more than 1 left
    if (this.state.count > 0) {
      const object = {};
      object[`${this.props.id}`] = 1;

      cleanMethod(this.props.popFunc, object, this.props.documentId, () =>
        this.setState({ count: this.state.count - 1 }));
    }
  }

  addValue() {
    this.setState({ count: this.state.count + 1 });
  }

  getArray() {
    const array = [];

    for (var i = 0; i < this.state.count; i++) {
      // If there are multiple components per array item
      array.push(
        <div className="mask1" style={{ marginBottom: 16 }} key={i}>
          {this.props.inputs.map(input => {
            const props = {
              ...this.props,
              ...input,
              id: `${this.props.id}.${i}.${input.id}`,
              currentValue: this.props.currentValue &&
                this.props.currentValue[i] &&
                this.props.currentValue[i][input.id],
              key: input.id,
            };

            if (input.type === 'textInput') {
              return <TextInput {...props} />;
            } else if (input.type === 'selectInput') {
              return <SelectFieldInput {...props} />;
            }
          })}
        </div>,
      );
    }

    return array;
  }

  render() {
    return (
      <div style={{ ...this.props.style, marginTop: 24 }}>
        <label htmlFor="">{this.props.label}</label>

        {this.getArray()}

        <div className="text-center">
          {this.state.count <= 0 &&
            <RaisedButton label="Ajouter" onTouchTap={this.addValue} />}
          {this.state.count > 0 &&
            <RaisedButton
              label="-"
              onTouchTap={this.removeValue}
              style={styles.button}
              disabled={this.state.count <= 0}
            />}
          {this.state.count > 0 &&
            <RaisedButton label="+" onTouchTap={this.addValue} primary />}
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
