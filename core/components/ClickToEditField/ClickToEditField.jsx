import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';

import Input from '../Material/Input';
import T from '../Translation';
import ClickToEditFieldContainer from './ClickToEditFieldContainer';

class ClickToEditField extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
    const { onSubmit, toggleEdit, value, onBlur } = this.props;
    const nextValue = this.input.current.value;

    if (nextValue !== value) {
      onSubmit(nextValue).then(() => toggleEdit(false));
    } else {
      toggleEdit(false);
    }

    if (onBlur) {
      onBlur();
    }
  };

  handleKeyDown = e => {
    if (e.keyCode === 13 && e.metaKey) {
      this.handleSubmit(e);
    }
  };

  renderValue() {
    const {
      isEditing,
      toggleEdit,
      value,
      placeholder,
      className,
      allowEditing = true,
      disabled,
      children,
      style,
      onFocus = () => null,
    } = this.props;

    const displayValue = value || placeholder;

    return (
      <div
        className={cx('click-to-edit-field', className, {
          'is-placeholder': placeholder && !value,
          'not-editing': allowEditing,
          'not-allowed-to-edit': !allowEditing,
        })}
        onClick={
          allowEditing && !disabled
            ? () => {
                onFocus();
                toggleEdit(true, () => this.input.current.focus());
              }
            : null
        }
        style={style}
      >
        {typeof children === 'function'
          ? children({ value: displayValue, isEditing })
          : displayValue}
      </div>
    );
  }

  render() {
    const {
      isEditing,
      toggleEdit,
      value,
      placeholder,
      inputProps,
      className,
      allowEditing = true,
      disabled,
      children,
      style,
      tooltipWhenDisabled = <T defaultMessage="Ce champ est vérouillé" />,
    } = this.props;

    if (isEditing) {
      return (
        <form
          className={cx('click-to-edit-field editing', className)}
          onSubmit={this.handleSubmit}
        >
          <Input
            defaultValue={value}
            inputRef={this.input}
            onBlur={this.handleSubmit}
            disabled={disabled}
            onKeyDown={this.handleKeyDown}
            {...inputProps}
          />
          {typeof children === 'function' &&
            children({ value: value || placeholder, isEditing })}
        </form>
      );
    }

    if (disabled && tooltipWhenDisabled) {
      return (
        <Tooltip title={tooltipWhenDisabled}>{this.renderValue()}</Tooltip>
      );
    }

    return this.renderValue();
  }
}

export default ClickToEditFieldContainer(ClickToEditField);
