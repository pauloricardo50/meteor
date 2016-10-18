import React from 'react';
import { AccountsTemplates } from 'meteor/useraccounts:core';


import Blaze from 'meteor/gadicc:blaze-react-component';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import 'meteor/templating';

import './accountform.js';
import './accountform.html';


export default class AccountsModal extends React.Component {

  componentWillMount() {
    console.log('willMount');
  }

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.close}>
        <Modal.Header>
          <Modal.Title>Login/S'enregistrer</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Blaze template="loginButtons" />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.close}>Annuler</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}


AccountsModal.propTypes = {
  showModal: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
}
