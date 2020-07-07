import React, { useEffect } from 'react';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { useFileViewer } from 'core/containers/FileViewerContext';

const PdfDisplayer = ({ buttonProps, pdfType, pdfProps }) => {
  const { displayPdf, pdfType: activePdfType } = useFileViewer();

  useEffect(() => {
    if (pdfType === activePdfType) {
      // Sync pdfProps with pdf viewer
      displayPdf(pdfType, pdfProps);
    }
  }, [pdfProps]);

  return (
    <Button
      raised
      label="Voir PDF"
      {...buttonProps}
      icon={<Icon type="attachFile" />}
      onClick={() => displayPdf(pdfType, pdfProps)}
    />
  );
};

export default PdfDisplayer;
