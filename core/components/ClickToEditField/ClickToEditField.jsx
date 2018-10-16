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
      onSubmit().then(() => toggleEdit(false));
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
    } = this.props;

    return isEditing ? (
      <form
        className="click-to-edit-field editing"
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
        className={cx('click-to-edit-field not-editing', {
          'is-placeholder': placeholder && !value,
        })}
        onClick={() => toggleEdit(true, () => this.input.current.focus())}
      >
        {value || placeholder}
      </div>
    );
  }
}
export default ClickToEditFieldContainer(ClickToEditField);
