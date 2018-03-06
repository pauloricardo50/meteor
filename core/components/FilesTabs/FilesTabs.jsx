import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import UploaderArray from 'core/components/UploaderArray';
import { T } from 'core/components/Translation';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesTabs = ({ loan, borrowers, property }) => (
  <div className="mask1">
    <Tabs defaultActiveKey={0} id="tabs">
      <Tab eventKey={0} title={<T id="general.mortgageLoan" />}>
        <div style={styles.tabContent}>
          <UploaderArray doc={loan} collection="loans" disabled />
        </div>
      </Tab>
      <Tab eventKey={1} title={<T id="general.property" />}>
        <div style={styles.tabContent}>
          <UploaderArray doc={property} collection="properties" disabled />
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
);

FilesTabs.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesTabs;
