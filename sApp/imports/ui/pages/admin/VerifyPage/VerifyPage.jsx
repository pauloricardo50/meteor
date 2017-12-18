import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import cleanMethod from 'core/api/cleanMethods';

import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';
// import DropDownMenu from 'core/components/Material/DropDownMenu';
import MenuItem from 'core/components/Material/MenuItem';
import Select from 'core/components/Select';

const styles = {
  dropdown: {
    width: 150,
  },
  buttons: {
    margin: 8,
  },
  finalButton: {
    marginTop: 40,
  },
};

export default class VerifyPage extends Component {
  constructor(props) {
    super(props);

    this.comments = [];

    const v = this.props.loanRequest.logic.verification;

    this.state = {
      comments: v.comments && v.comments.length ? v.comments : [''],
      validated: v.validated === undefined ? null : v.validated,
    };
  }

  handleChange = (_, value) => this.setState({ validated: value });

  handleChangeComment = (event, i) => {
    const array = this.state.comments.slice();
    array[i] = event.target.value;
    this.setState({ comments: array });
  };

  handleSubmit = () => {
    const object = {
      'logic.verification.requested': false,
      'logic.verification.comments': this.state.comments,
      'logic.verification.validated': this.state.validated,
    };

    cleanMethod(
      'updateRequest',
      object,
      this.props.loanRequest._id,
    ).then(() => {
      Meteor.call('adminActions.completeActionByType', {
        requestId: this.props.loanRequest._id,
        type: 'verify',
      });

      Meteor.call('email.send', {
        emailId: this.state.validated
          ? 'verificationPassed'
          : 'verificationError',
        requestId: this.props.loanRequest._id,
        userId: this.props.loanRequest.userId,
        template: 'notification+CTA',
      });

      window.close();
    });
  };

  render() {
    if (this.props.loanRequest.logic.verification.requested !== true) {
      return (
        <section className="text-center">
          <h1>Ce client n'a pas demandé de vérification</h1>
        </section>
      );
    }

    return (
      <section className="mask1">
        <h1>Vérifier un dossier</h1>

        <h3>Fichiers à ouvrir:</h3>
        <ul>
          <li>
            Demande de prêt:{' '}
            <span className="bold">{this.props.loanRequest._id}</span>
          </li>
          {this.props.borrowers.map((b, i) => (
            <li key={b._id}>
              Emprunteur {i + 1}: <span className="bold">{b._id}</span>
            </li>
          ))}
        </ul>

        <hr />

        <div className="text-center">
          <h2>Réponse</h2>
          <Select
            value={this.state.validated}
            onChange={this.handleChange}
            style={styles.dropdown}
            options={[
              { id: null },
              { id: true, label: 'Valide' },
              { id: false, label: 'Pas valide' },
            ]}
          />
        </div>

        {this.state.comments.map((c, i) => (
          <TextField
            key={i}
            value={c}
            multiline
            rows={2}
            fullWidth
            label={`Commentaire No.${i + 1}`}
            onChange={e => this.handleChangeComment(e, i)}
          />
        ))}
        <div className="text-center">
          <Button
            raised
            label="+"
            onClick={() =>
              this.setState(prev => ({ comments: [...prev.comments, ''] }))}
            primary
            style={styles.buttons}
          />
          <Button
            raised
            label="-"
            onClick={() =>
              this.setState(prev => ({
                comments: [...prev.comments].splice(-1, 1),
              }))}
            disabled={this.state.comments.length <= 1}
            style={styles.buttons}
          />
        </div>
        <div className="description">
          <p>Ceci enverra un email au client en notification</p>
        </div>
        <div className="text-center" style={styles.finalButton}>
          <Button
            raised
            label="Envoyer"
            primary
            disabled={
              !(
                this.state.validated === true ||
                (this.state.validated === false && this.state.comments[0])
              )
            }
            onClick={this.handleSubmit}
          />
        </div>
      </section>
    );
  }
}

VerifyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
