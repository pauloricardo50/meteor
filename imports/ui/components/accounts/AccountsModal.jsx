import React from 'react';

import Blaze from 'meteor/gadicc:blaze-react-component';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import 'meteor/templating';

import './accountform.js';
// import './accountform.html';


const modalInstance = props => (
  <Modal show={props.showModal} onHide={props.close}>
    <Modal.Header>
      <Modal.Title>Login/S'enregistrer</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Blaze template="accountForm" />
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={props.close}>Annuler</Button>
    </Modal.Footer>

  </Modal>
);

export default modalInstance;
