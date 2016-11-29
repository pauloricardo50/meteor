import React, { PropTypes } from 'react';


import DropzoneInput from '../forms/DropzoneInput.jsx';

const Step1TaxUpload = props => (
  <div className="mask1">
    <h3>Ma déclaration d'impôts</h3>
    <p>Uploadez votre dernière déclaration d'impôts en PDF ou en plusieurs photos.</p>
    <DropzoneInput fileName="taxes" requestId={props.creditRequest._id} />
  </div>
);

Step1TaxUpload.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Step1TaxUpload;
