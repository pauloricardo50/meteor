import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'core/components/TextInput';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { callMutation, mutations } from 'core/api';
import { T } from 'core/components/Translation/';

class AdminNotes extends React.Component {
  state = {
    textFieldText: this.props.adminNoteText,
    showButton: false,
  };

  handleChange = () => (id, value, event) =>
    this.setState({
      textFieldText: value,
      showButton: true,
    });

  saveAdminNote = ({ loanId, adminNoteText, textFieldText }) => () => {
    if (textFieldText !== adminNoteText) {
      callMutation(mutations.LOAN_CHANGE_ADMIN_NOTE, {
        loanId,
        adminNote: textFieldText,
      }).then(() => this.setState({ showButton: false }));
    }
  };

  render() {
    const { loanId, adminNoteText } = this.props;
    const { showButton, textFieldText } = this.state;

    return (
      <div className="flex container">
        <TextInput
          id="adminNote"
          label={<T id="AdminNote.adminNotes" />}
          fullWidth
          multiline
          value={this.state.textFieldText}
          onChange={this.handleChange()}
          placeholder="AdminNote.addNote"
          className="textField"
        />

        {showButton && (
          <Button
            variant="raised"
            size="small"
            tooltip={<T id="general.save" />}
            onClick={this.saveAdminNote({
              loanId,
              adminNoteText,
              textFieldText,
            })}
            className="saveButton"
          >
            <Icon className="leftIcon iconSmall" type="save" />
            {<T id="general.save" />}
          </Button>
        )}

        <br />
        <br />
      </div>
    );
  }
}

AdminNotes.propTypes = {
  adminNoteText: PropTypes.string.isRequired,
  loanId: PropTypes.string.isRequired,
};

export default AdminNotes;
