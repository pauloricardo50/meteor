import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { pushValue, popValue } from '/imports/api/loanrequests/methods';


const styles = {
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
  div: {
    marginTop: 10,
    marginBottom: 0,
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
      this.setState({
        value: newValue,
      }, this.addBorrower());
    }
  }

  handleClose() {
    this.setState({ modalIsOpen: false });
  }


  deleteBorrower() {
    this.handleClose();
    this.setState({ value: 1 });
    const value = {
      borrowers: 1,
    };
    const id = this.props.loanRequest._id;

    popValue.call({
      value, id
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
  }


  addBorrower() {
    const object = {
      borrowers: {
        civilStatus: 'single',
        bonusExists: false,
        corporateBankExists: false,
        currentRentExists: false,
      },
    };
    const id = this.props.loanRequest._id;

    pushValue.call({
      object, id
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
  }


  render() {
    const actions = [
      <FlatButton
        label="Annuler"
        onTouchTap={this.handleClose}
        primary
      />,
      <FlatButton
        label="Supprimer"
        onTouchTap={this.deleteBorrower}
        primary
      />,
    ];

    return (
      <div style={styles.div}>
        <label htmlFor="BorrowerCountSwitch">Combien d&apos;emprunteurs êtes vous?</label>
        <RadioButtonGroup
          name="BorrowerCountSwitch"
          defaultSelected={this.state.value}
          valueSelected={this.state.value}
          style={styles.RadioButtonGroup}
        >
          <RadioButton
            label="Un Emprunteur"
            value={1}
            onClick={this.setRadioButton}
            style={styles.RadioButton}
            labelStyle={styles.RadioButtonLabel}
          />
          <RadioButton
            label="Deux Emprunteurs"
            value={2}
            onClick={this.setRadioButton}
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
          entrées pour cet emprunteur seront effacées.
        </Dialog>
      </div>
    );
  }
}

BorrowerCountSwitch.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
