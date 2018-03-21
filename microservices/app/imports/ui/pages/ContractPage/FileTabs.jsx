import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import UploaderArray from 'core/components/UploaderArray';
import {
  loanDocuments,
  borrowerDocuments,
  propertyDocuments,
} from 'core/api/files/documents';
import { filesPercent } from 'core/arrays/steps';
import { T, IntlNumber } from 'core/components/Translation';
import withLoan from 'core/containers/withLoan';
import {
  FILE_STEPS,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from 'core/api/constants';

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
              value={filesPercent({
                doc: loan,
                fileArrayFunc: loanDocuments,
                step: FILE_STEPS.CONTRACT,
              })}
              format="percentageRounded"
            />
          </small>
        </span>
      }
      key={loan._id}
    >
      <div className="tab-content">
        <UploaderArray
          fileArray={loanDocuments(loan).contract}
          doc={loan}
          collection={LOANS_COLLECTION}
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
              value={filesPercent({
                doc: property,
                fileArrayFunc: propertyDocuments,
                step: FILE_STEPS.CONTRACT,
              })}
              format="percentageRounded"
            />
          </small>
        </span>
      }
      key={property._id}
    >
      <div className="tab-content">
        <UploaderArray
          fileArray={propertyDocuments(property).contract}
          doc={property}
          collection={PROPERTIES_COLLECTION}
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
                value={filesPercent({
                  doc: b,
                  fileArrayFunc: borrowerDocuments,
                  step: FILE_STEPS.CONTRACT,
                })}
                format="percentageRounded"
              />
            </small>
          </span>
        }
        key={b._id}
      >
        <div className="tab-content">
          <UploaderArray
            fileArray={borrowerDocuments(b).contract}
            doc={b}
            collection={BORROWERS_COLLECTION}
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
