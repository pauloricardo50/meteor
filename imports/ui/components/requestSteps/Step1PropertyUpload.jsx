import React, { PropTypes } from 'react';


import DropzoneInput from '../forms/DropzoneInput.jsx';

const Step1PropertyUpload = props => (
  <div className="mask1">
    <h3>Évaluer mon bien immobilier </h3>
    <h6>Uploadez les documents suivants pour permettre d'évaluer votre bien immmobilier:</h6>
    <ol>
      <li>Expertise Existante <small><a>Qu'est-ce que c'est?</a></small></li>
      <li>Photos extérieures</li>
      <li>Photos intérieures</li>
      <li>Etc.</li>
    </ol>
    <DropzoneInput fileName="housePicture" requestId={props.creditRequest._id} />
  </div>
);

Step1PropertyUpload.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Step1PropertyUpload;
