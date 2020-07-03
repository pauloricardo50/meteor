import React from 'react';
import { Text as ReactPdfText } from '@react-pdf/renderer';

const Text = ({ size, color, style, ...props }) => (
  <ReactPdfText
    style={[style, color && { color }, size && { fontSize: size }].filter(
      x => x,
    )}
    {...props}
  />
);

export default Text;
