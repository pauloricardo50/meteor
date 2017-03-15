import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import cleanMethod from '/imports/api/cleanMethods';

const styles = {
  div: {
    width: '100%',
    maxWidth: 400,
    marginTop: 10,
    marginBottom: 0,
  },
  RadioButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  RadioButton: {
    // Required or else the buttons disappear behind the background color..
    // File an issue with material-ui?
    zIndex: 0,
    width: 'auto',
    paddingLeft: '20',
  },
  RadioButtonLabel: {
    whiteSpace: 'nowrap',
  },
};

export default class BorrowerCountSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.loanRequest.borrowers.length,
      modalIsOpen: false,
    };

    this.setRadioButton = this.setRadioButton.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteBorrower = this.deleteBorrower.bind(this);
    this.addBorrower = this.addBorrower.bind(this);
  }

  setRadioButton(event) {
    const newValue = Number(event.target.value);

    if (newValue === 1) {
      // Open modal if the value goes from 2 to 1
      this.setState({
        modalIsOpen: true,
        // value: 2,
      });
    } else {
      // set state if value goes from 1 to 2 and add a borrower
      this.setState(
        {
          value: newValue,
        },
        this.addBorrower(),
      );
    }
  }

  handleClose() {
    this.setState({ modalIsOpen: false });
  }

  deleteBorrower() {
    if (this.props.loanRequest.borrowers.length > 1) {
      this.handleClose();
      this.setState({ value: 1 });
      const object = { borrowers: 1 };
      const id = this.props.loanRequest._id;

      cleanMethod('pop', id, object);
    }
  }

  addBorrower() {
    const object = {
      borrowers: {
        civilStatus: 'single',
        bonusExists: false,
        corporateBankExists: false,
        currentRentExists: false,
        files: [],
      },
    };
    const id = this.props.loanRequest._id;

    cleanMethod('push', id, object);
  }

  render() {
    const actions = [
      <FlatButton label="Annuler" onTouchTap={this.handleClose} primary />,
      <FlatButton label="Supprimer" onTouchTap={this.deleteBorrower} primary />,
    ];

    return (
      <div style={styles.div}>
        <label htmlFor="BorrowerCountSwitch">
          Combien d'emprunteurs êtes vous?
        </label>
        <RadioButtonGroup
          name="BorrowerCountSwitch"
          defaultSelected={this.state.value}
          valueSelected={this.state.value}
          style={styles.RadioButtonGroup}
        >
          <RadioButton
            label="Un Emprunteur"
            value={1}
            onTouchTap={this.setRadioButton}
            style={styles.RadioButton}
            labelStyle={styles.RadioButtonLabel}
          />
          <RadioButton
            label="Deux Emprunteurs"
            value={2}
            onTouchTap={this.setRadioButton}
            style={styles.RadioButton}
            labelStyle={styles.RadioButtonLabel}
          />
        </RadioButtonGroup>
        <Dialog
          title="Êtes vous sûr?"
          actions={actions}
          modal={false}
          open={this.state.modalIsOpen}
        >
          Si vous passez de deux emprunteurs à un emprunteur, toutes les données que vous avez
          entrées pour le 2ème emprunteur seront effacées.
        </Dialog>
      </div>
    );
  }
}

BorrowerCountSwitch.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
