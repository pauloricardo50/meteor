// @flow
import React from 'react';

const renderAddress = () => (
  <div className="loan-bank-pdf-header-address">
    <div>e-Potek SA</div>
    <div>Chemin Auguste-Vilbert 14</div>
    <div>CH-1218 Le Grand-Saconnex</div>
    <div>+41 22 566 01 10</div>
  </div>
);

const LoanBankHeader = () => (
  <div className="loan-bank-pdf-header">
    <img src="https://www.e-potek.ch/img/logo_square_black.svg" width="50px" />
    {renderAddress()}
  </div>
);

export default LoanBankHeader;
