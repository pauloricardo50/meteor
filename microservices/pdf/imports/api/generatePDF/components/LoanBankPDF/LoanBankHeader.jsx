// @flow
import React from 'react';

const LoanBankHeader = () => (
  <div className="loan-bank-pdf-header">
    <img src="https://www.e-potek.ch/img/logo_square_black.svg" width="50px" />
    <h4>{moment().format('DD.MM.YYYY')}</h4>
  </div>
);

export default LoanBankHeader;
