import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import { loanFiles, borrowerFiles, propertyFiles } from 'core/api/files/files';
import FileVerificator from './FileVerificator';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesVerification = ({ loan, borrowers, property }) => (
  <Tabs defaultActiveKey={0} id="tabs">
    <Tab eventKey={0} title="Prêt Hypothécaire">
      <div style={styles.tabContent}>
        {loanFiles(loan)
          .all()
          .map(file =>
            file.condition !== false && (
              <FileVerificator
                currentValue={loan.files[file.id]}
                docId={loan._id}
                key={file.id}
                id={file.id}
                closingSteps={loan.logic.closingSteps}
              />
            ))}
      </div>
    </Tab>

    <Tab eventKey={1} title="Bien Immobilier">
      <div style={styles.tabContent}>
        {propertyFiles(property)
          .all()
          .map(file =>
            file.condition !== false && (
              <FileVerificator
                currentValue={property.files[file.id]}
                docId={property._id}
                key={file.id}
                id={file.id}
                isProperty
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
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesVerification;
