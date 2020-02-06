import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';

import DocumentDownloadList from '../../DocumentDownloadList';

const isAdmin = Meteor.microservice === 'admin';
const isPro = Meteor.microservice === 'pro';

const shouldDisplayProDocuments = documents =>
  (isAdmin || isPro) && !!documents && !!documents.proDocuments;

const PromotionFiles = ({ promotion: { documents } }) => (
  <div
    className="animated fadeIn"
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
  >
    <DocumentDownloadList files={documents && documents.promotionDocuments} />
    {shouldDisplayProDocuments(documents) && (
      <>
        <h2 style={{ alignSelf: 'center' }}>
          <FontAwesomeIcon
            icon={faLock}
            className="icon"
            style={{ marginRight: '8px' }}
          />
          Documents Pros
        </h2>
        <DocumentDownloadList files={documents && documents.proDocuments} />
      </>
    )}
  </div>
);

export default PromotionFiles;
