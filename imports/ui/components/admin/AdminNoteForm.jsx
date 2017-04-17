import PropTypes from 'prop-types';
import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  buttonDiv: {
    marginTop: 15,
    marginBottom: 15,
  },
};

export default class AdminNoteForm extends Component {
  handleSubmit = event => {
    event.preventDefault();

    console.log('TODO :)');
  };

  render() {
    return (
      <form action="submit">
        <TextField
          floatingLabelText="Description de l'intéraction"
          hintText="Client a demandé une explication de l'amortissement indirect.."
          fullWidth
          multiLine
          rows={5}
        />
        <div className="pull-right" style={styles.buttonDiv}>
          <RaisedButton
            label="Ajouter"
            primary
            onTouchTap={this.handleSubmit}
            type="submit"
          />
        </div>
      </form>
    );
  }
}

AdminNoteForm.propTypes = {
};
