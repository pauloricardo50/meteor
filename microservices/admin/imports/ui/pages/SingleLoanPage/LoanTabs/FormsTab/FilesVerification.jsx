import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from 'core/api/constants';
import {
  loanDocuments,
  borrowerDocuments,
  propertyDocuments,
} from 'core/api/files/documents';
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
        {loanDocuments(loan)
          .all()
          .map(file =>
            file.condition !== false && (
              <FileVerificator
                currentValue={loan.files[file.id]}
                docId={loan._id}
                key={file.id}
                id={file.id}
                closingSteps={loan.logic.closingSteps}
                collection={LOANS_COLLECTION}
              />
            ))}
      </div>
    </Tab>

    <Tab eventKey={1} title="Bien Immobilier">
      <div style={styles.tabContent}>
        {propertyDocuments(property)
          .all()
          .map(file =>
            file.condition !== false && (
              <FileVerificator
                currentValue={property.files[file.id]}
                docId={property._id}
                key={file.id}
                id={file.id}
                collection={PROPERTIES_COLLECTION}
              />
            ))}
      </div>
    </Tab>

    {borrowers.map((b, index) => (
      <Tab eventKey={index + 2} title={b.firstName} key={b._id}>
        <div style={styles.tabContent}>
          {borrowerDocuments(b)
            .all()
            .map(file =>
              file.condition !== false && (
                <FileVerificator
                  currentValue={b.files[file.id]}
                  docId={b._id}
                  key={file.id}
                  id={file.id}
                  collection={BORROWERS_COLLECTION}
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
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesVerification;
