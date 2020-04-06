import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FILE_ROLES } from '../../../api/files/fileConstants';
import { getFileRolesArray } from '../../../api/files/fileHelpers';
import DocumentDownloadList from '../../DocumentDownloadList';

const isAdmin = Meteor.microservice === 'admin';
const isPro = Meteor.microservice === 'pro';

const PromotionFiles = ({ promotion: { documents = {} } }) => {
  const { promotionDocuments = [] } = documents;
  const publicDocuments = promotionDocuments.filter(file => {
    const roles = getFileRolesArray(file);
    return !roles.length || roles.includes(FILE_ROLES.PUBLIC);
  });
  const proDocuments = promotionDocuments.filter(file => {
    const { Key: fileKey } = file;
    const roles = getFileRolesArray(file);
    return (
      roles.includes(FILE_ROLES.PRO) &&
      !publicDocuments.some(({ Key }) => Key === fileKey)
    );
  });
  const adminDocuments = promotionDocuments.filter(file => {
    const { Key: fileKey } = file;
    const roles = getFileRolesArray(file);
    return (
      roles.includes(FILE_ROLES.ADMIN) &&
      !proDocuments.some(({ Key }) => Key === fileKey)
    );
  });

  return (
    <div
      className="animated fadeIn"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <DocumentDownloadList files={publicDocuments} />
      {(isPro || isAdmin) && !!proDocuments.length && (
        <>
          <h2 style={{ alignSelf: 'center' }}>
            <FontAwesomeIcon
              icon={faLock}
              className="icon"
              style={{ marginRight: '8px' }}
            />
            Documents Pros
          </h2>
          <DocumentDownloadList files={proDocuments} />
        </>
      )}
      {isAdmin && !!adminDocuments.length && (
        <>
          <h2 style={{ alignSelf: 'center' }}>
            <FontAwesomeIcon
              icon={faLock}
              className="icon"
              style={{ marginRight: '8px' }}
            />
            Documents Admin
          </h2>
          <DocumentDownloadList files={adminDocuments} />
        </>
      )}
    </div>
  );
};

export default PromotionFiles;
