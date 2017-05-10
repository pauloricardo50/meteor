import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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
      comments: v.comments.length ? v.comments : [''],
      validated: v.validated === undefined ? null : v.validated,
    };
  }

  handleChange = (event, index, value) => this.setState({ validated: value });

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

    cleanMethod('updateRequest', object, this.props.loanRequest._id, () => window.close());
  };

  render() {
    if (this.props.loanRequest.logic.verification.requested !== true) {
      return <div className="text-center"><h1>Ce client n'a pas demandé de vérification</h1></div>;
    }

    return (
      <div>
        <section className="mask1">
          <h1>Vérifier un dossier</h1>

          <div className="text-center">
            <DropDownMenu
              value={this.state.validated}
              onChange={this.handleChange}
              autoWidth={false}
              style={styles.dropdown}
            >
              <MenuItem value={null} />
              <MenuItem value primaryText="Valide" />
              <MenuItem value={false} primaryText="Pas Valide" />
            </DropDownMenu>
          </div>

          <div>
            {this.state.comments.map((c, i) => (
              <TextField
                value={c}
                multiLine
                rows={2}
                fullWidth
                floatingLabelText={`Commentaire No.${i + 1}`}
                onChange={e => this.handleChangeComment(e, i)}
              />
            ))}
            <div className="text-center">
              <RaisedButton
                label="+"
                onTouchTap={() => this.setState(prev => ({ comments: [...prev.comments, ''] }))}
                primary
                style={styles.buttons}
              />
              <RaisedButton
                label="-"
                onTouchTap={() =>
                  this.setState(prev => ({ comments: [...prev.comments].splice(-1, 1) }))}
                disabled={this.state.comments.length <= 1}
                style={styles.buttons}
              />
            </div>
          </div>
          <div className="text-center" style={styles.finalButton}>
            <RaisedButton
              label="Envoyer"
              primary
              disabled={
                !(this.state.validated === true ||
                  (this.state.validated === false && this.state.comments[0]))
              }
              onTouchTap={this.handleSubmit}
            />
          </div>
        </section>
      </div>
    );
  }
}

VerifyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
