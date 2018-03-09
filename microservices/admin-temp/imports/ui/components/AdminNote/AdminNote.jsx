import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';
import { callMutation, mutations } from 'core/api';
import { T } from 'core/components/Translation/';

const styles = {
  container: {
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  textField: {
    paddingBottom: 20,
  },
  button: {
    marginLeft: 0,
  },
};

class AdminNotes extends React.Component {
  state = {
    textFieldText: this.props.adminNoteText,
    showButton: false,
  };

  handleChange = () => event =>
    this.setState({
      textFieldText: event.target.value,
      showButton: true,
    });

  saveAdminNote = ({ loanId, adminNoteText, textFieldText }) => () => {
    if (textFieldText !== adminNoteText) {
      callMutation(mutations.LOAN_CHANGE_ADMIN_NOTE, {
        loanId,
        adminNote: textFieldText,
      }).then(this.setState({ showButton: false }));
    }
  };

  render() {
    const { loanId, adminNoteText } = this.props;
    const { showButton, textFieldText } = this.state;

    return (
      <div className="flex" style={styles.container}>
        <TextField
          label={<T id="AdminNote.adminNotes" />}
          fullWidth
          multiline
          value={this.state.textFieldText}
          onChange={this.handleChange()}
          margin="normal"
          // placeholder={<T id="AdminNote.addNote" />}
          helperText={<T id="AdminNote.addNote" />}
          style={styles.textField}
        />

        {showButton && (
          <Button
            variant="raised"
            size="small"
            onClick={this.saveAdminNote({
              loanId,
              adminNoteText,
              textFieldText,
            })}
            style={styles.button}
          >
            <Save className="leftIcon iconSmall" />
            Save
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
