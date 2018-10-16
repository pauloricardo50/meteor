// @flow
import React from 'react';

import DocumentDownloadList from '../../DocumentDownloadList/DocumentDownloadList';

type PromotionPageDocumentsProps = {};

const PromotionPageDocuments = ({
  promotion: { documents },
}: PromotionPageDocumentsProps) => (
  <DocumentDownloadList files={documents && documents.promotionDocuments} />
);

export default PromotionPageDocuments;
