//
import React, { Component } from 'react';
import cx from 'classnames';

import Tooltip from '@material-ui/core/Tooltip';
import Input from '../Material/Input';
import ClickToEditFieldContainer from './ClickToEditFieldContainer';
import T from '../Translation';

class ClickToEditField extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
    const { onSubmit, toggleEdit, value } = this.props;
    const nextValue = this.input.current.value;

    if (nextValue !== value) {
      onSubmit(nextValue).then(() => toggleEdit(false));
    } else {
      toggleEdit(false);
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
            ? () => toggleEdit(true, () => this.input.current.focus())
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
      tooltipWhenDisabled = <T id="general.clickToEditField.disabledTooltip" />,
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
