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

  render() {
    const {
      isEditing,
      toggleEdit,
      value,
      placeholder,
      inputProps,
      className,
      allowEditing = true,
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
          allowEditing
            ? () => toggleEdit(true, () => this.input.current.focus())
            : null
        }
      >
        {value || placeholder}
      </div>
    );
  }
}
export default ClickToEditFieldContainer(ClickToEditField);
