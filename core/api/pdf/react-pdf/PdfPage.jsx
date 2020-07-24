import React from 'react';
import { Page } from '@react-pdf/renderer';

const PdfPage = ({ style, ...props }) => (
  <Page
    size="A4"
    style={[
      {
        flexDirection: 'column',
        fontFamily: 'Manrope-extralight',
        padding: '25mm',
        fontSize: 10,
        alignItems: 'stretch',
      },
      style,
    ].filter(x => x)}
    {...props}
  />
);

export default PdfPage;
