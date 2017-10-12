import PropTypes from 'prop-types';
import React, { Component } from 'react';

import TextField from '/imports/ui/components/general/Material/TextField';
import Button from '/imports/ui/components/general/Button';

const styles = {
  buttonDiv: {
    marginTop: 15,
    marginBottom: 15,
  },
};

export default class AdminNoteForm extends Component {
  handleSubmit = (event) => {
    event.preventDefault();

    console.log('TODO :)');
  };

  render() {
    return (
      <form action="submit">
        <TextField
          label="Description de l'intéraction"
          hintText="Client a demandé une explication de l'amortissement indirect.."
          fullWidth
          multiline
          rows={5}
        />
        <div className="pull-right" style={styles.buttonDiv}>
          <Button
            raised
            label="Ajouter"
            primary
            onClick={this.handleSubmit}
            type="submit"
          />
        </div>
      </form>
    );
  }
}

AdminNoteForm.propTypes = {};
