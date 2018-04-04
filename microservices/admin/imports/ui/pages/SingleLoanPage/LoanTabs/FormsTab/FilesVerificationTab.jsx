import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import FileVerificator from './FileVerificator';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesVerificationTab = ({
  index,
  title,
  documentArray,
  doc,
  ...otherProps
}) => (
  <Tab eventKey={index} title={title}>
    <div style={styles.tabContent}>
      {documentArray.map(({ condition, id: documentId }) =>
        condition !== false && (
          <FileVerificator
            currentValue={
              doc.documents[documentId] && doc.documents[documentId].files
            }
            docId={doc._id}
            key={documentId}
            id={documentId}
            {...otherProps}
          />
        ))}
    </div>
  </Tab>
);

FilesVerificationTab.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  documentArray: PropTypes.array.isRequired,
  doc: PropTypes.object.isRequired,
};

export default FilesVerificationTab;
