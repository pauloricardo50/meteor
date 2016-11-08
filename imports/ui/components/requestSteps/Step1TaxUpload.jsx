import React from 'react';


import DropzoneInput from '../forms/DropzoneInput.jsx';

const Step1TaxUpload = () => (
  <div className="mask1">
    <h3>Ma déclaration d'impôts</h3>
    <p>Uploadez votre dernière déclaration d'impôts en PDF ou en plusieurs photos.</p>
    <DropzoneInput />
  </div>
);

export default Step1TaxUpload;
