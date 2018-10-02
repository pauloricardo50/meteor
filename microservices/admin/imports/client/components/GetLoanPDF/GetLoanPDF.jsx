// @flow
import React from 'react';
import { DDP } from 'meteor/ddp-client';
import fileSaver from 'file-saver';
import { base64ToBlob } from './base64-to-blob';
import Button from '../../../core/components/Button/Button';

type GetLoanPDFProps = {
  loan: Object,
};

const handleClick = (loan) => {
  console.log('loan', loan);

  const remote = DDP.connect('http://localhost:5500');
  remote.call(
    'generatePDF',
    {
      type: 'LOAN_BANK',
      data: { loan },
    },
    (err, res) => {
      if (err) {
        console.log('Error', err);
      } else {
        const blob = base64ToBlob(res.base64);
        fileSaver.saveAs(blob, res.fileName);
      }
    },
  );
};

const GetLoanPDF = ({ loan }: GetLoanPDFProps) => (
  <Button onClick={() => handleClick(loan)}>Generate PDF</Button>
);

export default GetLoanPDF;
