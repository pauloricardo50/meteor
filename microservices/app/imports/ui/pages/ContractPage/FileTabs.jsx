import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import UploaderArray from 'core/components/UploaderArray';

import { loanFiles, borrowerFiles, propertyFiles } from 'core/api/files/files';
import { filesPercent } from 'core/arrays/steps';
import { T, IntlNumber } from 'core/components/Translation';
import withLoan from 'core/containers/withLoan';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
  tabTitle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const FileTabs = ({ loan, borrowers, property }) => (
  <Tabs defaultActiveKey={0} id="tabs" mountOnEnter>
    <Tab
      eventKey={0}
      title={
        <span>
          <T id="general.mortgageLoan" />
          <small className="secondary">
            {' '}
            &bull;{' '}
            <IntlNumber
              value={filesPercent(loan, loanFiles, 'contract')}
              format="percentageRounded"
            />
          </small>
        </span>
      }
      key={loan._id}
    >
      <div style={styles.tabContent}>
        <UploaderArray
          fileArray={loanFiles(loan).contract}
          doc={loan}
          collection="loans"
        />
      </div>
    </Tab>
    <Tab
      eventKey={1}
      title={
        <span>
          <T id="general.property" />
          <small className="secondary">
            {' '}
            &bull;{' '}
            <IntlNumber
              value={filesPercent(property, propertyFiles, 'contract')}
              format="percentageRounded"
            />
          </small>
        </span>
      }
      key={property._id}
    >
      <div style={styles.tabContent}>
        <UploaderArray
          fileArray={propertyFiles(property).contract}
          doc={property}
          collection="properties"
        />
      </div>
    </Tab>
    {borrowers.map((b, index) => (
      <Tab
        eventKey={index + 2}
        title={
          <span>
            {b.firstName}
            <small className="secondary">
              {' '}
              &bull;{' '}
              <IntlNumber
                value={filesPercent(b, borrowerFiles, 'contract')}
                format="percentageRounded"
              />
            </small>
          </span>
        }
        key={b._id}
      >
        <div style={styles.tabContent}>
          <UploaderArray
            fileArray={borrowerFiles(b).contract}
            doc={b}
            collection="borrowers"
            key={b._id}
          />
        </div>
      </Tab>
    ))}
  </Tabs>
);

FileTabs.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withLoan(FileTabs);
