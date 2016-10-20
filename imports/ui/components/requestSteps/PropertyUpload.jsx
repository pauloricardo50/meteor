import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import DropzoneInput from '../forms/DropzoneInput.jsx';

const PropertyUpload = () => (
  <Panel>
    <h3>Évaluer mon bien immobilier </h3>
    <h6>Uploadez les documents suivants pour permettre d'évaluer votre bien immmobilier:</h6>
    <ol>
      <li>Expertise Existante <small><a>Qu'est-ce que c'est?</a></small></li>
      <li>Photos extérieures</li>
      <li>Photos intérieures</li>
      <li>Etc.</li>
    </ol>
    <DropzoneInput />
  </Panel>
);

export default PropertyUpload;
