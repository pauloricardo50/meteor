import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';

import Tabs from 'core/components/Tabs';
import Calculator from 'core/utils/Calculator';

import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';
import FileTabsContainer from './FileTabsContainer';
import FileTabLabel from './FileTabLabel';
import SingleFileTab from './SingleFileTab';
import Loading from '../Loading';
import T from '../Translation';

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
          {
            label: (
              <FileTabLabel
                title={<T id="collections.borrowers" />}
                progress={Calculator.getBorrowerFilesProgress({
                  loan,
                  borrowers,
                })}
              />
            ),
            content: (
              <div className="borrowers-file-tab">
                {borrowers.map((borrower, index) => (
                  <div key={borrower._id}>
                    <div className="borrower-name">
                      <FontAwesomeIcon icon={faUserCircle} className="icon" />
                      <h1>
                        {borrower.name || (
                          <T
                            id="general.borrowerWithIndex"
                            values={{ index: index + 1 }}
                          />
                        )}
                      </h1>
                    </div>
                    <SingleFileTab
                      doc={borrower}
                      collection="borrowers"
                      disabled={disabled}
                      currentUser={currentUser}
                      loan={loan}
                    />
                  </div>
                ))}
              </div>
            ),
          },
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
                  loan={loan}
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
                loan={loan}
              />
            ),
          },
        ]}
        scrollable
        scrollButtons="auto"
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
