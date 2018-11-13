import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import Calculator from 'core/utils/Calculator';
import {
  getPropertyDocuments,
  getBorrowerDocuments,
  getLoanDocuments,
} from 'core/api/files/documents';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';
import FileTabsContainer from './FileTabsContainer';
import FileTabLabel from './FileTabLabel';
import SingleFileTab from './SingleFileTab';
import Loading from '../Loading';

const FileTabs = ({ loan, borrowers, properties, disabled, currentUser }) => {
  if (!loan.documentsLoaded) {
    return <Loading />;
  }

  return (
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
                  loan,
                  borrowers: borrower,
                })}
              />
            ),
            content: (
              <SingleFileTab
                doc={borrower}
                collection="borrowers"
                disabled={disabled}
                currentUser={currentUser}
              />
            ),
          })),
          ...(!loan.hasPromotion && properties.length > 0
            ? properties.map(property => ({
              label: (
                <FileTabLabel
                  id="general.property"
                  title={property.address1}
                  progress={Calculator.getPropertyFilesProgress({
                    property,
                    loan,
                  })}
                />
              ),
              content: (
                <SingleFileTab
                  doc={property}
                  collection="properties"
                  disabled={disabled}
                  currentUser={currentUser}
                />
              ),
            }))
            : []),
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
                currentUser={currentUser}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

FileTabs.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabsContainer(FileTabs);
