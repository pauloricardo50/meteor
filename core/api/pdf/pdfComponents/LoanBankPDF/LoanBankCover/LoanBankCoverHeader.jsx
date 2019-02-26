// @flow
import React from 'react';

type LoanBankCoverHeaderProps = {};

const LoanBankCoverHeader = ({ organisation }: LoanBankCoverHeaderProps) => (
  <div className="cover-header">
    <h1>
      <img
        src="https://www.e-potek.ch/img/logo_square_black_no_border.svg"
        className="epotek-logo"
      />
      e-Potek SA
      {organisation && <span className="logo-divider" />}
      {organisation && (
        <img src={organisation.logo} className="organisation-logo" />
      )}
    </h1>
    <div className="e-potek-address">
      <h6>
        <b>e-Potek SA</b>
      </h6>
      <h6>Chemin Auguste-Vilbert 14</h6>
      <h6>1218 Le Grand-Saconnex</h6>
      <h6>+41 22 566 01 10</h6>
    </div>
  </div>
);

export default LoanBankCoverHeader;
