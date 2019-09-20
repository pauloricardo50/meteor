// @flow
import React from 'react';

import DocumentDownloadList from '../../DocumentDownloadList';

type PromotionFilesProps = {};

const PromotionFiles = ({ promotion: { documents } }: PromotionFilesProps) => (
  <div className="animated fadeIn">
    <DocumentDownloadList files={documents && documents.promotionDocuments} />
  </div>
);

export default PromotionFiles;
