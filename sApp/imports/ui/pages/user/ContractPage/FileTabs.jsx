import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import UploaderArray from '/imports/ui/components/general/UploaderArray';

import { requestFiles, borrowerFiles } from '/imports/js/arrays/files';
import { filesPercent } from '/imports/js/arrays/steps';
import { T, IntlNumber } from '/imports/ui/components/general/Translation';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
  tabTitle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const FileTabs = ({ loanRequest, borrowers }) => (
  <Tabs defaultActiveKey={1} id="tabs" mountOnEnter>
    <Tab
      eventKey={1}
      title={
        <span>
          <T id="general.property" />
          <small className="secondary">
            {' '}
            &bull;{' '}
            <IntlNumber
              value={filesPercent(loanRequest, requestFiles, 'contract')}
              format="percentageRounded"
            />
          </small>
        </span>
      }
      key={loanRequest._id}
    >
      <div style={styles.tabContent}>
        <UploaderArray
          fileArray={requestFiles(loanRequest).contract}
          doc={loanRequest}
          collection="loanRequests"
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
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabs;
