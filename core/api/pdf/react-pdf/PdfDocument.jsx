import React from 'react';
import { Document } from '@react-pdf/renderer';

const PdfDocument = props => (
  <Document
    author="e-Potek SA"
    creator="e-Potek SA"
    producer="e-Potek SA"
    {...props}
  />
);

export default PdfDocument;
