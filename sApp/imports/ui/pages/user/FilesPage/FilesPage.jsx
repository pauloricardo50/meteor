import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import Page from '/imports/ui/components/general/Page';
import UploaderArray from '/imports/ui/components/general/UploaderArray';
import { T } from 'core/components/Translation';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesPage = ({ loanRequest, borrowers }) => (
  <Page id="FilesPage">
    <div className="mask1">
      <p style={{ marginBottom: 32 }}>
        <T id="FilesPage.description" />
      </p>

      <Tabs defaultActiveKey={1} id="tabs">
        <Tab eventKey={1} title="Bien Immobilier">
          <div style={styles.tabContent}>
            <UploaderArray
              doc={loanRequest}
              collection="loanRequests"
              disabled
            />
          </div>
        </Tab>
        {borrowers.map((b, index) => (
          <Tab eventKey={index + 2} title={b.firstName} key={b._id}>
            <div style={styles.tabContent}>
              <UploaderArray doc={b} collection="borrowers" disabled />
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  </Page>
);

FilesPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesPage;
