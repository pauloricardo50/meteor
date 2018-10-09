// @flow
import React from 'react';
import fileSaver from 'file-saver';
import { compose, withState, withProps } from 'recompose';
import Button from 'core/components/Button/Button';
import { generateLoanBankPDF } from 'core/api/PDFGenerator/methodDefinitions';
import { base64ToBlob } from './base64-to-blob';

type GetLoanPDFProps = {
  loan: Object,
  loading: boolean,
  handleClick: Function,
};

const GetLoanPDF = ({ loan, loading, handleClick }: GetLoanPDFProps) => (
  <Button onClick={() => handleClick(loan._id)} loading={loading}>
    Generate PDF
  </Button>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ setLoading, loan: { name } }) => ({
    handleClick: (loanId) => {
      setLoading(true);
      generateLoanBankPDF
        .run({ loanId })
        .then(base64 => fileSaver.saveAs(base64ToBlob(base64), `${name}.pdf`))
        .catch((error) => {
          throw new Meteor.error(error);
        })
        .finally(() => setLoading(false));
    },
  })),
)(GetLoanPDF);
