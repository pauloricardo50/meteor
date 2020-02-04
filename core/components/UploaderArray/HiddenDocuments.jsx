//      
import React from 'react';
import withHider from 'core/containers/withHider';
import UploaderArray from './UploaderArray';

                               

const HiddenDocuments = (props                      ) => (
  <UploaderArray {...props} isDocumentToHide canModify />
);

export default withHider({
  label: 'Afficher tous les documents',
  primary: true,
  style: { alignSelf: 'center', marginBottom: '16px' },
})(HiddenDocuments);
