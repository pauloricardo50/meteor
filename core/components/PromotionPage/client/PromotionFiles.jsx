// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';

import DocumentDownloadList from '../../DocumentDownloadList';

type PromotionFilesProps = {};

const isAdmin = Meteor.microservice === 'admin';
const isPro = Meteor.microservice === 'pro';

const getDocuments = documents => {
  const { promotionDocuments = [], proDocuments = [] } = documents;

  return [...promotionDocuments, ...(isAdmin || isPro ? proDocuments : [])];
};

const PromotionFiles = ({ promotion: { documents } }: PromotionFilesProps) => (
  <div className="animated fadeIn">
    <DocumentDownloadList files={getDocuments(documents)} />
  </div>
);

export default PromotionFiles;
