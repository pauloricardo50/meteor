import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';

import UploaderArray from 'core/components/UploaderArray';
import {
  loanDocuments,
  borrowerDocuments,
  propertyDocuments,
} from 'core/api/files/documents';
import { filesPercent } from 'core/arrays/steps';
import { T, IntlNumber } from 'core/components/Translation';
import {
  FILE_STEPS,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from 'core/api/constants';

const FileTabs = ({ loan, borrowers, property }) => (
  <Tabs
    id="tabs"
    tabs={[
      {
        label: (
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
        ),
        content: (
          <UploaderArray
            documentArray={loanDocuments(loan).contract}
            doc={loan}
            collection={LOANS_COLLECTION}
          />
        ),
      },
      {
        label: (
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
        ),
        content: (
          <UploaderArray
            documentArray={propertyDocuments(property).contract}
            doc={property}
            collection={PROPERTIES_COLLECTION}
          />
        ),
      },
      ...borrowers.map(b => ({
        label: (
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
        ),
        content: (
          <UploaderArray
            documentArray={borrowerDocuments(b).contract}
            doc={b}
            collection={BORROWERS_COLLECTION}
            key={b._id}
          />
        ),
      })),
    ]}
  />
);

FileTabs.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FileTabs;
