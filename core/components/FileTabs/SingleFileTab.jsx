// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import UploaderArray from '../UploaderArray';
import AdditionalDocAdder from './AdditionalDocAdder';
import {
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  LOANS_COLLECTION,
  BORROWER_DOCUMENTS,
  PROPERTY_DOCUMENTS,
  LOAN_DOCUMENTS,
} from '../../api/constants';
import {
  getBorrowerDocuments,
  getPropertyDocuments,
  getLoanDocuments,
} from '../../api/files/documents';

type SingleFileTabProps = {
  collection: Sring,
  doc: Object,
  disabled: Boolean,
  documentArray: Array<Object>,
  currentUser: Object,
  loan: Object,
};

const allDocuments = ({ doc, collection }) => {
  let documents = [];
  switch (collection) {
  case BORROWERS_COLLECTION:
    documents = Object.values(BORROWER_DOCUMENTS).map(id => ({
      id,
    }));
    break;
  case PROPERTIES_COLLECTION:
    documents = Object.values(PROPERTY_DOCUMENTS).map(id => ({
      id,
    }));
    break;
  case LOANS_COLLECTION:
    documents = Object.values(LOAN_DOCUMENTS).map(id => ({
      id,
    }));
    break;
  default:
    break;
  }

  return doc.additionalDocuments && doc.additionalDocuments.length > 0
    ? [
      ...doc.additionalDocuments,
      ...documents.filter(({ id }) =>
        !doc.additionalDocuments.some(document => id === document.id)),
    ]
    : documents;
};

const documentsToDisplay = ({ collection, loan, id }) => {
  switch (collection) {
  case BORROWERS_COLLECTION:
    return getBorrowerDocuments({ loan, id });
  case PROPERTIES_COLLECTION:
    return getPropertyDocuments({ loan, id });
  case LOANS_COLLECTION:
    return getLoanDocuments({ loan, id });
  default:
    return [];
  }
};

const documentsToHide = ({ doc, collection, loan, id }) =>
  allDocuments({ doc, collection }).filter(document =>
    !documentsToDisplay({ collection, loan, id }).some(({ id: docId }) => docId === document.id));

const SingleFileTab = ({
  collection,
  doc,
  disabled,
  documentArray,
  currentUser,
  loan,
}: SingleFileTabProps) => (
  <div className="single-file-tab">
    {Meteor.microservice === 'admin' && (
      <AdditionalDocAdder collection={collection} docId={doc._id} />
    )}

    <UploaderArray
      doc={doc}
      collection={collection}
      disabled={disabled}
      currentUser={currentUser}
      loan={loan}
      documentArray={
        documentArray || documentsToDisplay({ collection, loan, id: doc._id })
      }
    />
    {Meteor.microservice === 'admin' && (
      <UploaderArray
        doc={doc}
        collection={collection}
        disabled={disabled}
        currentUser={currentUser}
        loan={loan}
        documentArray={documentsToHide({
          collection,
          loan,
          id: doc._id,
          doc,
        })}
        isDocumentToHide
      />
    )}
  </div>
);

export default SingleFileTab;
