// @flow
import React from 'react';
import withHider from 'core/containers/withHider';
import UploaderArray from './UploaderArray';

type HiddenDocumentsProps = {};

const HiddenDocuments = (props: HiddenDocumentsProps) => (
  <UploaderArray {...props} isDocumentToHide canModify />
);

export default withHider({
  label: 'Afficher tous les documents',
  primary: true,
})(HiddenDocuments);
