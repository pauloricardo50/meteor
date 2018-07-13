import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import UploaderArray from 'core/components/UploaderArray';
import T from 'core/components/Translation';
import FileTabsContainer from './FileTabsContainer';

const FileTabs = ({ loan, borrowers, property, disabled }) => (
  <div className="files-tab">
    <Tabs
      id="tabs"
      tabs={[
        {
          label: <T id="general.mortgageLoan" />,
          content: (
            <UploaderArray doc={loan} collection="loans" disabled={disabled} />
          ),
        },
        {
          label: <T id="general.property" />,
          content: (
            <UploaderArray
              doc={property}
              collection="properties"
              disabled={disabled}
            />
          ),
        },
        ...borrowers.map((borrower, index) => ({
          label: borrower.firstName || `Emprunteur ${index + 1}`,
          content: (
            <UploaderArray
              doc={borrower}
              collection="borrowers"
              disabled={disabled}
            />
          ),
        })),
      ]}
    />
  </div>
);

FileTabs.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FileTabsContainer(FileTabs);
