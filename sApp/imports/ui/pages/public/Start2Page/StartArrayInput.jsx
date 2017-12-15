import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from '/imports/ui/components/general/Button';

import { T } from 'core/components/Translation';
import StartTextField from './StartTextField';
import StartSelectField from './StartSelectField';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class ArrayInput extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 1 };
  }

  getOptions = (input, i) => {
    // Give each option the proper label from react-intl
    const optionsWithLabels = input.options.map(
      o =>
        (o.id === undefined
          ? { id: o, label: <T id={`Forms.${this.props.id}.${o}`} /> }
          : {
            ...o,
            label: <T id={`Forms.${this.props.id}.${o.id}`} />,
          }),
    );

    if (!this.props.allOptions) {
      const currentValues = this.props.formState[this.props.id] || [];
      const thisVal = currentValues && currentValues[i];
      const arr = currentValues.map(v => v && v.description);
      const thisOption = optionsWithLabels.find(
        o => (o && o.id) === (thisVal && thisVal.description),
      );

      return [
        ...optionsWithLabels.filter(x => arr.indexOf(x.id) < 0),
        thisOption || {},
      ];
    }

    return optionsWithLabels;
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
      const arr =
        (this.props.formState[this.props.id] &&
          this.props.formState[this.props.id].slice(0)) ||
        [];
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

      this.setState({ count: this.state.count - 1 }, () =>
        this.props.setFormState(this.props.id, arr),
      );
    } else {
      // If only one entry, and the user hits -, delete all values and set the exist Id to false
      this.props.setFormState(this.props.id, []);
      this.props.setFormState(this.props.existId, false);
    }
  };

  render() {
    const {
      formState,
      inputs,
      className,
      setActiveLine,
      text1,
      id,
      active,
      allOptions,
    } = this.props;
    const { count } = this.state;
    const inputProps = {
      ...this.props,
      formState: { ...formState },
      // setformState: setformState,
      setActiveLine: () => null,
    };
    const optionQty = inputs.find(i => i.id === 'description').options.length;

    return (
      <article className={className} onClick={() => setActiveLine(id)}>
        {text1 && <h1 className="fixed-size">{text1}</h1>}

        {[...Array(count)].map((e, i) => (
          <h1 key={i} className="fixed-size array-input">
            {inputs.map((input, j) => (
              <span key={`${input.id}_${i}${j}`} className="array-input-span">
                {i === 0 && (
                  <label id={id}>
                    <T id={`Forms.${id}.${input.id}`} />
                  </label>
                )}

                {input.type === 'textInput' && (
                  <StartTextField
                    {...input}
                    {...inputProps}
                    id={input.id}
                    setFormState={(id2, v, cb) =>
                      this.setArrayFormState(id2, v, cb, i)}
                    value={
                      formState[id] &&
                      formState[id][i] &&
                      formState[id][i][input.id]
                    }
                    autoFocus={j === 0 && inputProps.autoFocus}
                    array
                  />
                )}

                {input.type === 'selectInput' && (
                  <StartSelectField
                    {...input}
                    {...inputProps}
                    id={input.id}
                    setFormState={(id2, v, cb) =>
                      this.setArrayFormState(id2, v, cb, i)}
                    value={
                      formState[id] &&
                      formState[id][i] &&
                      formState[id][i][input.id]
                    }
                    options={this.getOptions(input, i)}
                    autoFocus={j === 0 && inputProps.autoFocus}
                  />
                )}
              </span>
            ))}
          </h1>
        ))}
        <div className={!active ? 'inputHider' : 'animated fadeIn'}>
          <Button
            raised
            label="+"
            primary
            onClick={this.handleAdd}
            style={styles.button}
            disabled={!allOptions && count >= optionQty}
          />
          <Button
            raised
            label="-"
            onClick={this.handleRemove}
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
