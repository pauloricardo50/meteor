// @flow
import React from 'react';

import T from '../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import PdfGoogleMap from './PdfGoogleMap';
import PdfPropertyDetails from './PdfPropertyDetails';
import Calculator from '../../../../../utils/Calculator';
import OtherRealEstateTable from './OtherRealEstateTable';

type PropertyPdfPageProps = {};

const PropertyPdfPage = ({ loan, pageNb, pageCount }: PropertyPdfPageProps) => {
  const realEstateExists = Calculator.getRealEstateValue({ loan }) > 0;

  return (
    <PdfPage
      className="property-page"
      title={<T id="PDF.title.property" />}
      withFooter
      pageNb={pageNb}
      pageCount={pageCount}
    >
      <PdfGoogleMap loan={loan} />
      <div className="property-tables">
        <PdfPropertyDetails loan={loan} />
        {realEstateExists && <OtherRealEstateTable loan={loan} />}
      </div>
    </PdfPage>
  );
};
export default PropertyPdfPage;
