import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';

import Tabs from 'core/components/Tabs';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import VerticalAligner from 'core/components/VerticalAligner';
import SingleFileTab from 'core/components/FileTabs/SingleFileTab';
import {
  getBorrowerDocuments,
  getInsuranceRequestDocuments,
  getInsuranceDocuments,
} from 'core/api/files/documents';

const InsuranceRequestFileTabs = ({
  insuranceRequest,
  disabled,
  currentUser,
}) => {
  const [basicOnly, setBasicOnly] = useState(false);
  const { borrowers = [], insurances = [] } = insuranceRequest;

  return (
    <div className="files-tab">
      <div className="files-tab-container">
        <Tabs
          id="tabs"
          // Fetch new files every time you change tabs
          onChangeCallback={() => ClientEventService.emit(MODIFIED_FILES_EVENT)}
          tabs={[
            borrowers.length && {
              label: <span>Assurés</span>,
              content: (
                <>
                  <div
                    style={{ margin: '16px 0' }}
                    className="flex-col center-align"
                  >
                    <b htmlFor="" style={{ margin: 'auto' }}>
                      Afficher
                    </b>
                    <RadioTabs
                      options={[
                        { id: false, label: 'Tous' },
                        { id: true, label: 'Essentiels' },
                      ]}
                      onChange={setBasicOnly}
                      value={basicOnly}
                    />
                  </div>
                  <div className="borrowers-file-tab">
                    {borrowers.map((borrower, index) => (
                      <div
                        key={borrower._id}
                        className="borrowers-file-tab-single"
                      >
                        {borrowers.length > 1 && (
                          <div className="borrower-name">
                            <FontAwesomeIcon
                              icon={faUserCircle}
                              className="icon"
                            />
                            <h1>{borrower.name || `Assuré ${index + 1}`}</h1>
                          </div>
                        )}
                        <VerticalAligner
                          id="borrower-files"
                          nb={index}
                          defaultMargin={16}
                        >
                          <SingleFileTab
                            doc={borrower}
                            disabled={disabled}
                            currentUser={currentUser}
                            basicOnly={basicOnly}
                            documentArray={getBorrowerDocuments(
                              { id: borrower._id },
                              { doc: borrower },
                            )}
                            collection="borrowers"
                            withAdditionalDocAdder={false}
                          />
                        </VerticalAligner>
                      </div>
                    ))}
                  </div>
                </>
              ),
            },
            ...insurances.map(insurance => {
              const { insuranceProduct, borrower } = insurance;

              return {
                label: (
                  <span>
                    {insuranceProduct.name}&nbsp;-&nbsp;
                    {borrower.name ||
                      borrowers.map(
                        (b, i) =>
                          ({ ...b, index: i }.find(
                            ({ _id }) => _id === borrower._id,
                          ).index),
                      )}
                  </span>
                ),
                content: (
                  <SingleFileTab
                    doc={insurance}
                    disabled={disabled}
                    currentUser={currentUser}
                    documentArray={getInsuranceDocuments(
                      { id: insurance._id },
                      { doc: insurance },
                    )}
                    collection="insurances"
                    withAdditionalDocAdder={false}
                  />
                ),
              };
            }),
            {
              label: <span>Dossier assurance</span>,
              content: (
                <SingleFileTab
                  doc={insuranceRequest}
                  disabled={disabled}
                  currentUser={currentUser}
                  documentArray={getInsuranceRequestDocuments(
                    { id: insuranceRequest._id },
                    { doc: insuranceRequest },
                  )}
                  collection="insuranceRequests"
                  withAdditionalDocAdder={false}
                />
              ),
            },
          ].filter(x => x)}
          variant="scrollable"
          scrollButtons="auto"
        />
      </div>
    </div>
  );
};

export default InsuranceRequestFileTabs;
