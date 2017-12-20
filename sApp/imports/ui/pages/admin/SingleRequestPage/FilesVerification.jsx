import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import { requestFiles, borrowerFiles } from 'core/api/files/files';
import FileVerificator from './FileVerificator';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesVerification = ({ loanRequest, borrowers }) => (
  <Tabs defaultActiveKey={1} id="tabs">
    <Tab eventKey={1} title="Bien Immobilier">
      <div style={styles.tabContent}>
        {requestFiles(loanRequest)
          .all()
          .map(file =>
              file.condition !== false && (
                <FileVerificator
                  currentValue={loanRequest.files[file.id]}
                  docId={loanRequest._id}
                  key={file.id}
                  id={file.id}
                  closingSteps={loanRequest.logic.closingSteps}
                />
              ))}
      </div>
    </Tab>
    {borrowers.map((b, index) => (
      <Tab eventKey={index + 2} title={b.firstName} key={b._id}>
        <div style={styles.tabContent}>
          {borrowerFiles(b)
            .all()
            .map(file =>
                file.condition !== false && (
                  <FileVerificator
                    currentValue={b.files[file.id]}
                    docId={b._id}
                    key={file.id}
                    id={file.id}
                    isBorrower
                  />
                ))}
        </div>
      </Tab>
    ))}
  </Tabs>
);

FilesVerification.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesVerification;
