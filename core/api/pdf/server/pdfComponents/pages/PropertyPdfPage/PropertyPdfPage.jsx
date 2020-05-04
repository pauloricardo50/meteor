import React from 'react';

import T from '../../../../../../components/Translation';
import Calculator from '../../../../../../utils/Calculator';
import PdfPage from '../../PdfPage';
import OtherRealEstateTable from './OtherRealEstateTable';
import PdfGoogleMap from './PdfGoogleMap';
import PdfPropertyDetails from './PdfPropertyDetails';

const PropertyPdfPage = ({ loan, pageNb, pageCount }) => {
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
        <PdfPropertyDetails
          loan={loan}
          style={realEstateExists ? {} : { width: '100%' }}
        />
        {realEstateExists && <OtherRealEstateTable loan={loan} />}
      </div>
    </PdfPage>
  );
};
export default PropertyPdfPage;
