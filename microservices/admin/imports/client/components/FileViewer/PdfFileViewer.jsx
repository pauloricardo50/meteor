import React from 'react';
import { IntlProvider } from 'react-intl';

import Loadable from 'core/utils/loadable';

import messagesFR from '../../../../lang/fr.json';

const PDFViewer = Loadable({
  loader: () => import('@react-pdf/renderer').then(module => module.PDFViewer),
});

const PdfFileViewer = ({ pdfType, pdfProps }) => {
  // eslint-disable-next-line import/order
  import pdfComponents from 'core/api/pdf/react-pdf/pdfComponents';

  const PdfComponent = pdfComponents[pdfType];

  return (
    <PDFViewer>
      <IntlProvider messages={messagesFR} defaultLocale="fr">
        <PdfComponent {...pdfProps} />
      </IntlProvider>
    </PDFViewer>
  );
};

// Don't rerender this component if the props don't change, it's expensive
// to drag the UI width
export default React.memo(PdfFileViewer);
