// @flow
import React from 'react';

const address = () => (
  <div className="address">
    <div className="company-name">e-Potek SA</div>
    <div>Chemin Auguste-Vilbert 14</div>
    <div>1218 Le Grand-Saconnex</div>
    <div>Suisse</div>
    <div>+41 22 566 01 10</div>
  </div>
);

const LoanBankHeader = () => (
  <div className="header pdf-header">
    <img
      src="https://www.e-potek.ch/img/logo_square_black.svg"
      style={{ width: 50, height: 50 }}
    />
    {address()}
  </div>
);

export default LoanBankHeader;
