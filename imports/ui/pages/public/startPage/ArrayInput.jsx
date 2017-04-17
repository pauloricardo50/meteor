import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';

import StartTextField from './StartTextField';
import StartSelectField from './StartSelectField';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class ArrayInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1,
    };
  }

  getOptions = (input, i) => {
    if (!this.props.allOptions) {
      const currentValues = this.props.formState[this.props.id] || [];
      const thisVal = currentValues && currentValues[i];
      const arr = currentValues.map(v => v && v.description);
      const thisOption = input.options.find(
        o => (o && o.id) === (thisVal && thisVal.description),
      );

      return [
        ...input.options.filter(x => arr.indexOf(x.id) < 0),
        thisOption || {},
      ];
    }

    return input.options;
  };

  setArrayFormState = (id, value, callback, i) => {
    // Copy current array or initialize it
    const arr = (this.props.formState[this.props.id] &&
      this.props.formState[this.props.id].slice(0)) || [{}];
    // Don't do anything or append new value
    arr[i] = (arr && arr[i]) || {};
    arr[i][id] = value;

    this.props.setFormState(this.props.id, arr);
  };

  handleAdd = () => {
    this.setState({ count: this.state.count + 1 }, () => {
      // Push an empty object to array
      const arr = (this.props.formState[this.props.id] &&
        this.props.formState[this.props.id].slice(0)) || [];
      const object = {};
      object[this.props.id] = arr.push({});

      this.props.setFormState(this.props.id, arr);
    });
  };

  handleRemove = () => {
    if (this.state.count > 1) {
      // Also remove the last values from array
      const arr = this.props.formState[this.props.id].slice(0);
      const object = {};
      object[this.props.id] = arr.pop();

      this.setState(
        { count: this.state.count - 1 },
        () => this.props.setFormState(this.props.id, arr),
      );
    } else {
      // If only one entry, and the user hits -, delete all values and set the exist Id to false
      this.props.setFormState(this.props.id, []);
      this.props.setFormState(this.props.existId, false);
    }
  };

  render() {
    const inputProps = {
      ...this.props,
      formState: { ...this.props.formState },
      // setformState: this.props.setformState,
      setActiveLine: () => null,
    };
    const optionQty = this.props.inputs.find(
      i => i.id === 'description',
    ).options.length;

    return (
      <article
        className={this.props.className}
        onTouchTap={() => this.props.setActiveLine(this.props.id)}
      >
        {this.props.text1 && <h1 className="fixed-size">{this.props.text1}</h1>}

        {[...Array(this.state.count)].map((e, i) => (
          <h1 key={i} className="fixed-size array-input">
            {this.props.inputs.map((input, j) => (
              <span key={`${input.id}_${i}${j}`} className="array-input-span">

                {i === 0 && <label id={this.props.id}>{input.label}</label>}

                {input.type === 'textInput' &&
                  <StartTextField
                    {...input}
                    {...inputProps}
                    id={input.id}
                    setFormState={(id, v, cb) =>
                      this.setArrayFormState(id, v, cb, i)}
                    value={
                      this.props.formState[this.props.id] &&
                        this.props.formState[this.props.id][i] &&
                        this.props.formState[this.props.id][i][input.id]
                    }
                    autoFocus={j === 0 && inputProps.autoFocus}
                  />}

                {input.type === 'selectInput' &&
                  <StartSelectField
                    {...input}
                    {...inputProps}
                    id={input.id}
                    setFormState={(id, v, cb) =>
                      this.setArrayFormState(id, v, cb, i)}
                    value={
                      this.props.formState[this.props.id] &&
                        this.props.formState[this.props.id][i] &&
                        this.props.formState[this.props.id][i][input.id]
                    }
                    options={this.getOptions(input, i)}
                    autoFocus={j === 0 && inputProps.autoFocus}
                  />}

              </span>
            ))}
          </h1>
        ))}
        <div className={!this.props.active ? 'inputHider' : 'animated fadeIn'}>
          <RaisedButton
            label="+"
            primary
            onTouchTap={this.handleAdd}
            style={styles.button}
            disabled={!this.props.allOptions && this.state.count >= optionQty}
          />
          <RaisedButton
            label="-"
            onTouchTap={this.handleRemove}
            style={styles.button}
          />
        </div>
      </article>
    );
  }
}

ArrayInput.defaultProps = {
  text1: '',
  allOptions: false,
};

ArrayInput.propTypes = {
  active: PropTypes.bool,
  formState: PropTypes.objectOf(PropTypes.any),
  setFormState: PropTypes.func.isRequired,
  inputs: PropTypes.arrayOf(PropTypes.any).isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  existId: PropTypes.string,
  allOptions: PropTypes.bool,
};
