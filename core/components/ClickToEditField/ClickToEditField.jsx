// @flow
import React, { Component } from 'react';

import ClickToEditFieldContainer from './ClickToEditFieldContainer';
import Input from '@material-ui/core/Input';

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
    const { onSubmit, toggleEdit } = this.props;
    event.preventDefault();
    onSubmit(this.input.current.value).then(() => toggleEdit(false));
  };

  render() {
    const { isEditing, toggleEdit, value, placeholder } = this.props;

    return isEditing ? (
      <form
        className="click-to-edit-field editing"
        onSubmit={this.handleSubmit}
      >
        <Input
          defaultValue={value}
          inputRef={this.input}
          onBlur={() => toggleEdit(false)}
        />
      </form>
    ) : (
      <div
        className="click-to-edit-field not-editing"
        onClick={() => toggleEdit(true, () => this.input.current.focus())}
      >
        {value || placeholder}
      </div>
    );
  }
}
export default ClickToEditFieldContainer(ClickToEditField);
