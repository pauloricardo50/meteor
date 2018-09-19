import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import Calculator from 'core/utils/Calculator';
import {
  getDocumentArrayByStep,
  loanDocuments,
  propertyDocuments,
  borrowerDocuments,
} from 'core/api/files/documents';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';
import FileTabsContainer from './FileTabsContainer';
import FileTabLabel from './FileTabLabel';
import SingleFileTab from './SingleFileTab';

const FileTabs = ({ loan, borrowers, property, disabled }) => (
  <div className="files-tab">
    <Tabs
      id="tabs"
      // Fetch new files every time you change tabs
      onChangeCallback={() => ClientEventService.emit(MODIFIED_FILES_EVENT)}
      tabs={[
        ...borrowers.map((borrower, index) => ({
          label: (
            <FileTabLabel
              title={borrower.firstName || `Emprunteur ${index + 1}`}
              progress={Calculator.getBorrowerFilesProgress({
                borrowers: borrower,
              })}
            />
          ),
          content: (
            <SingleFileTab
              doc={borrower}
              collection="borrowers"
              disabled={disabled}
              documentArray={getDocumentArrayByStep(
                () => borrowerDocuments(borrower),
                'auction',
              )}
            />
          ),
        })),
        {
          label: (
            <FileTabLabel
              id="general.property"
              progress={Calculator.getPropertyFilesProgress({ loan })}
            />
          ),
          content: (
            <SingleFileTab
              doc={property}
              collection="properties"
              disabled={disabled}
              documentArray={getDocumentArrayByStep(
                () => propertyDocuments(property, loan),
                'auction',
              )}
            />
          ),
        },
        {
          label: (
            <FileTabLabel
              id="FileTabs.loanDocuments"
              progress={Calculator.getLoanFilesProgress({ loan })}
            />
          ),
          content: (
            <SingleFileTab
              doc={loan}
              collection="loans"
              disabled={disabled}
              documentArray={getDocumentArrayByStep(
                () => loanDocuments(loan),
                'auction',
              )}
            />
          ),
        },
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
