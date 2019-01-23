// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import AdditionalDocAdder from './AdditionalDocAdder';
import {
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  LOANS_COLLECTION,
} from '../../api/constants';
import {
  getBorrowerDocuments,
  getPropertyDocuments,
  getLoanDocuments,
  allDocuments,
} from '../../api/files/documents';

import UploaderCategories from './UploaderCategories';

type SingleFileTabProps = {
  collection: Sring,
  doc: Object,
  disabled: Boolean,
  documentArray: Array<Object>,
  currentUser: Object,
  loan: Object,
};

const documentsToDisplay = ({ collection, loan, id }) => {
  switch (collection) {
  case BORROWERS_COLLECTION: {
    return getBorrowerDocuments({ loan, id });
  }
  case PROPERTIES_COLLECTION:
    return getPropertyDocuments({ loan, id });
  case LOANS_COLLECTION:
    return getLoanDocuments({ loan, id });
  default:
    return [];
  }
};

const documentsToHide = ({ doc, collection, loan, id }) => {
  const allDocs = allDocuments({ doc, collection });
  return allDocs.filter((document) => {
    const docsToDisplay = documentsToDisplay({ collection, loan, id });
    return !docsToDisplay.some(({ id: docId }) => docId === document.id);
  });
};

const SingleFileTab = ({ documentArray, ...props }: SingleFileTabProps) => {
  const { collection, loan, doc } = props;
  return (
    <div className="single-file-tab">
      {Meteor.microservice === 'admin' && (
        <AdditionalDocAdder collection={collection} docId={doc._id} />
      )}
      <UploaderCategories
        documentsToDisplay={
          documentArray || documentsToDisplay({ collection, loan, id: doc._id })
        }
        documentsToHide={documentsToHide({
          collection,
          loan,
          id: doc._id,
          doc,
        })}
        canModify
        {...props}
      />
    </div>
  );
};

export default SingleFileTab;
