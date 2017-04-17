import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  firstButton: {
    float: 'left',
  },
  secondButton: {
    float: 'right',
  },
};

export default class NewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  componentDidMount() {
    // Make sure the user doesn't visit this by error, or if the address has already been set
    const requestId = this.props.match.params.requestId;
    if (requestId) {
      const request = this.props.loanRequests.find(r => r._id === requestId);
      if (request.property.address1) {
        this.props.history.push('/app');
      }
    } else {
      this.props.history.push('/app');
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const object = {};
    object['property.address1'] = this.state.value;

    cleanMethod(
      'updateRequest',
      object,
      this.props.match.params.requestId,
      () => this.props.history.push('/app'),
      {
        title: 'Formidable',
        message: `<h4 class="bert">C'est parti pour ${this.state.value}</h4>`,
      },
    );
  };

  render() {
    return (
      <div className="absolute-wrapper new-page">
        <section className="mask1 animated fadeIn">
          <h2>Entrez le nom de la rue et le numéro</h2>
          <p className="secondary">
            Ça nous permet de donner un nom à votre projet
          </p>
          <form onSubmit={this.handleSubmit}>
            <div className="text-center">
              <TextField
                name="address"
                hintText="Rue du Pré 2"
                floatingLabelText="Adresse du bien immobilier"
                autoFocus
                value={this.state.value}
                onChange={this.handleChange}
              />
            </div>
            <br />
            <br />
            <RaisedButton
              label="Continuer"
              primary
              style={styles.secondButton}
              type="submit"
              disabled={!this.state.value}
            />
          </form>
        </section>
      </div>
    );
  }
}

NewPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NewPage.defaultProps = {
  loanRequests: [],
};
