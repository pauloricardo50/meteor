// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import UploaderArray from '../UploaderArray';
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
import HiddenDocuments from '../UploaderArray/HiddenDocuments';

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

const SingleFileTab = ({ documentArray, ...props }: SingleFileTabProps) => {
  const { collection, loan, doc } = props;
  return (
    <div className="single-file-tab">
      {Meteor.microservice === 'admin' && (
        <AdditionalDocAdder collection={collection} docId={doc._id} />
      )}

      <UploaderArray
        documentArray={
          documentArray || documentsToDisplay({ collection, loan, id: doc._id })
        }
        {...props}
      />
      {Meteor.microservice === 'admin' && (
        <HiddenDocuments
          documentArray={documentsToHide({
            collection,
            loan,
            id: doc._id,
            doc,
          })}
          {...props}
        />
      )}
    </div>
  );
};

export default SingleFileTab;
