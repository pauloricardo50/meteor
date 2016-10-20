import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import DropzoneInput from '../forms/DropzoneInput.jsx';

const TaxUpload = () => (
  <Panel>
    <h3>Ma déclaration d'impôts</h3>
    <p>Uploadez votre dernière déclaration d'impôts en PDF ou en plusieurs photos.</p>
    <DropzoneInput />
  </Panel>
);

export default TaxUpload;
