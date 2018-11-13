import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import Uploader from './Uploader';
import {
  BORROWERS_COLLECTION,
  BORROWER_DOCUMENTS,
  PROPERTIES_COLLECTION,
  PROPERTY_DOCUMENTS,
  LOANS_COLLECTION,
  LOAN_DOCUMENTS,
} from '../../api/constants';

import UploaderArrayContainer from './UploaderArrayContainer';

const UploaderArray = ({
  doc,
  disabled,
  collection,
  currentUser,
  documentsToDisplay,
  documentsToHide,
  getFileMeta,
}) => {
  if (Meteor.microservice === 'admin') {
    return (
      <div className="flex-col center">
        <h3>Documents requis</h3>
        {documentsToDisplay.map(documentObject => (
          <Uploader
            fileMeta={
              getFileMeta({ doc, id: documentObject.id }) || documentObject
            }
            key={doc._id + documentObject.id}
            currentValue={doc.documents && doc.documents[documentObject.id]}
            docId={doc._id}
            disabled={disabled}
            collection={collection}
            currentUser={currentUser}
            isDocumentToHide={false}
          />
        ))}
        <h3>Autres documents</h3>
        {documentsToHide.map(documentObject => (
          <Uploader
            fileMeta={
              getFileMeta({ doc, id: documentObject.id }) || documentObject
            }
            key={doc._id + documentObject.id}
            currentValue={doc.documents && doc.documents[documentObject.id]}
            docId={doc._id}
            disabled={disabled}
            collection={collection}
            currentUser={currentUser}
            isDocumentToHide
          />
        ))}
      </div>
    );
  }

  if (!documentsToDisplay) {
    return null;
  }

  if (documentsToDisplay.length === 0) {
    return (
      <p className="description">
        <T id="UploaderArray.empty" />
      </p>
    );
  }

  return (
    <div className="flex-col center">
      {documentsToDisplay.map(documentObject => (
        <Uploader
          fileMeta={
            getFileMeta({ doc, id: documentObject.id }) || documentObject
          }
          key={doc._id + documentObject.id}
          currentValue={doc.documents && doc.documents[documentObject.id]}
          docId={doc._id}
          disabled={disabled}
          collection={collection}
          currentUser={currentUser}
          isDocumentToHide={false}
        />
      ))}
    </div>
  );
};

UploaderArray.propTypes = {
  collection: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploaderArray.defaultProps = {
  disabled: false,
};

export default UploaderArrayContainer(UploaderArray);
