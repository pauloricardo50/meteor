// @flow
import React from 'react';

import T from '../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import PdfGoogleMap from './PdfGoogleMap';
import PdfPropertyDetails from './PdfPropertyDetails';

type PropertyPdfPageProps = {};

const PropertyPdfPage = ({ loan, pageNb, pageCount }: PropertyPdfPageProps) => (
  <PdfPage
    className="property-page"
    title={<T id="PDF.title.property" />}
    withFooter
    pageNb={pageNb}
    pageCount={pageCount}
  >
    <PdfGoogleMap loan={loan} />
    <PdfPropertyDetails loan={loan} />
  </PdfPage>
);

export default PropertyPdfPage;
