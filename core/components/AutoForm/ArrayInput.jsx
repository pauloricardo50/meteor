import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from '../Button';
import T from '../Translation';
import AutoFormTextInput from './AutoFormTextInput';
import AutoFormDateInput from './AutoFormDateInput';
import AutoFormSelectFieldInput from './AutoFormSelectFieldInput';
import ValidIcon from './ValidIcon';

const styles = {
  button: {
    marginRight: 8,
  },
  arrayItem: {
    marginBottom: 16,
    overflow: 'unset',
  },
  savingIcon: { top: -7, right: -12 },
};

class ArrayInput extends Component {
  constructor(props) {
    super(props);

    const count = (this.props.inputProps.currentValue || []).length;

    this.state = {
      count,
      showRecap: count > 1,
    };
  }

  getArray = () => {
    const array = [];
    const {
      inputProps: { id, currentValue, inputs },
      disabled,
    } = this.props;

    const mapInput = (input, i) => {
      const {
        id: inputId,
        type,
        options,
        transform,
        intlId,
        Component: CustomComponent,
        inputLabelProps: { shrink } = {},
      } = input;
      const finalCurrentValue =
        currentValue && currentValue[i] && currentValue[i][inputId];
      const childProps = {
        ...this.props,
        inputProps: {
          notched: shrink,
          ...input,
          id: `${id}.${i}.${inputId}`,
          currentValue: finalCurrentValue,
          itemValue: currentValue && currentValue[i],
          key: inputId,
          label: <T id={`Forms.${intlId || id}.${inputId}`} />,
          placeholder: `Forms.${intlId || id}.${inputId}.placeholder`,
          required: true,
          disabled,
        },
      };

      if (type === 'textInput') {
        return <AutoFormTextInput {...childProps} key={id + inputId + i} />;
      }
      if (type === 'selectInput') {
        // Map these labels here to prevent having the id being xxx.0 or xxx.1
        // and mess up the labels in the SelectFieldInput
        childProps.inputProps.options = options.map(opt =>
          opt.id === undefined
            ? {
                id: opt,
                label: transform ? (
                  transform(opt)
                ) : (
                  <T id={`Forms.${intlId || id}.${opt}`} />
                ),
              }
            : {
                ...opt,
                label: transform ? (
                  transform(opt)
                ) : (
                  <T id={`Forms.${intlId || id}.${opt.id}`} />
                ),
              },
        );
        return (
          <AutoFormSelectFieldInput {...childProps} key={id + inputId + i} />
        );
      }
      if (type === 'dateInput') {
        return <AutoFormDateInput {...childProps} key={id + inputId + i} />;
      }

      if (type === 'custom') {
        return <CustomComponent {...childProps} />;
      }
    };

    for (let i = 0; i < this.state.count; i += 1) {
      // If there are multiple components per array item
      array.push(
        <div
          className="card1 card-top card-top"
          style={styles.arrayItem}
          key={`${id + i}item`}
        >
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
    this.props
      .popFunc({
        object: { [`${this.props.inputProps.id}`]: 1 },
        id: this.props.docId,
      })
      .then(() => this.setState({ count: this.state.count - 1 }));

  render() {
    const {
      inputProps: {
        style,
        label,
        disabled,
        renderRecap,
        currentValue,
        required,
      },
    } = this.props;
    const { count, showRecap } = this.state;

    const shouldShowRecap = showRecap && renderRecap;

    return (
      <div
        className="flex-col"
        style={{ ...style, marginBottom: 24, position: 'relative' }}
      >
        <label htmlFor="" style={{ marginBottom: 8 }}>
          {label}
        </label>

        {shouldShowRecap ? (
          <div
            className="card1 card-top flex-col center-align"
            onClick={() => this.setState({ showRecap: false })}
            style={{ alignSelf: 'center' }}
          >
            <span className="mb-8">{renderRecap(currentValue)}</span>
            <Button primary>Modifier</Button>
          </div>
        ) : (
          this.getArray()
        )}

        {!shouldShowRecap && (
          <div className="text-center" style={{ position: 'relative' }}>
            {count <= 0 && (
              <>
                <Button
                  raised
                  label={<T id="ArrayInput.add" />}
                  onClick={this.addValue}
                  disabled={disabled}
                />
                {required && <ValidIcon style={styles.savingIcon} todo />}
              </>
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
        )}
      </div>
    );
  }
}

ArrayInput.propTypes = {
  currentValue: PropTypes.arrayOf(PropTypes.any),
  docId: PropTypes.string.isRequired,
  id: PropTypes.string,
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.node,
  popFunc: PropTypes.func.isRequired,
};

ArrayInput.defaultProps = {
  currentValue: [],
  id: undefined,
  label: undefined,
};

export default ArrayInput;
