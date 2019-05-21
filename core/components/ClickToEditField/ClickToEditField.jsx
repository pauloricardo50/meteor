// @flow
import React, { Component } from 'react';
import cx from 'classnames';

import Input from '@material-ui/core/Input';
import ClickToEditFieldContainer from './ClickToEditFieldContainer';

type ClickToEditFieldProps = {
  isEditing: boolean,
  toggleEdit: Function,
  value: string,
  placeholder?: string,
  onSubmit: Function,
};

class ClickToEditField extends Component<ClickToEditFieldProps> {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSubmit, toggleEdit, value } = this.props;
    const nextValue = this.input.current.value;

    if (nextValue !== value) {
      onSubmit(nextValue).then(() => toggleEdit(false));
    } else {
      toggleEdit(false);
    }
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.metaKey) {
      this.handleSubmit(e);
    }
  };

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
    } = this.props;

    return isEditing ? (
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
      </form>
    ) : (
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
      >
        {typeof children === 'function'
          ? children(value || placeholder)
          : value || placeholder}
      </div>
    );
  }
}
export default ClickToEditFieldContainer(ClickToEditField);
