import React from 'react';

const LoanBankCoverHeader = ({ loanName }) => (
  <div className="cover-header">
    <h1>
      <img
        src="https://www.e-potek.ch/img/logo_square_black_no_border.svg"
        className="epotek-logo"
      />
      e-Potek SA
    </h1>
    <h3>
      <span>Référence dossier</span>
      <span>{loanName}</span>
    </h3>
    <div className="e-potek-address">
      <h6>
        <b>e-Potek SA</b>
      </h6>
      <h6>Place de Neuve 2</h6>
      <h6>1204 Genève</h6>
      <h6>+41 22 566 01 10</h6>
    </div>
  </div>
);

export default LoanBankCoverHeader;
