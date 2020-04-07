import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import {
  allDocuments,
  getBorrowerDocuments,
  getLoanDocuments,
  getPropertyDocuments,
} from '../../api/files/documents';
import { LOANS_COLLECTION } from '../../api/loans/loanConstants';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';
import AdditionalDocAdder from './AdditionalDocAdder';
import UploaderCategories from './UploaderCategories';

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

const documentsToHide = ({ doc, collection, loan, id, documentArray }) => {
  const allDocs = allDocuments({ doc, collection });
  const docsToDisplay =
    documentArray || documentsToDisplay({ collection, loan, id });
  return allDocs.filter(
    document => !docsToDisplay.some(({ id: docId }) => docId === document.id),
  );
};

const SingleFileTab = ({ documentArray, ...props }) => {
  const {
    collection,
    loan,
    doc,
    className,
    withAdditionalDocAdder = true,
    basicOnly,
  } = props;

  let displayedDocs =
    documentArray || documentsToDisplay({ collection, loan, id: doc._id });
  let hiddenDocs = documentsToHide({
    collection,
    loan,
    id: doc._id,
    doc,
    documentArray,
  });

  if (typeof basicOnly === 'boolean' && basicOnly) {
    displayedDocs = displayedDocs.filter(({ id }) =>
      BASIC_DOCUMENTS_LIST.includes(id),
    );
    hiddenDocs = hiddenDocs.filter(({ id }) =>
      BASIC_DOCUMENTS_LIST.includes(id),
    );
  }

  return (
    <div className={cx('single-file-tab', className)}>
      {withAdditionalDocAdder && Meteor.microservice === 'admin' && (
        <AdditionalDocAdder collection={collection} docId={doc._id} />
      )}
      <UploaderCategories
        documentsToDisplay={displayedDocs}
        documentsToHide={hiddenDocs}
        canModify
        {...props}
      />
    </div>
  );
};

export default SingleFileTab;
