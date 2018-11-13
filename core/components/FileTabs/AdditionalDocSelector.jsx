// @flow
import React from 'react';

type AdditionalDocSelectorProps = {
  docId: String,
  collection: String,
  additionalDocuments: Array<Object>,
  documentArray: Array<Object>,
};

const AdditionalDocSelector = ({
  docId,
  collection,
  additionalDocuments,
  documentArray,
}: AdditionalDocSelectorProps) => (
  <div>
    Hello World
    {console.log('addDoc, docarray', additionalDocuments, documentArray)}
  </div>
);

export default AdditionalDocSelector;
