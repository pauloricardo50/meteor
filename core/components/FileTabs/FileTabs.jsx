import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import PropTypes from 'prop-types';

import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../api/events/ClientEventService';
import { FILE_ROLES } from '../../api/files/fileConstants';
import {
  setFileRoles,
  updateDocumentsCache,
} from '../../api/files/methodDefinitions';
import { addBorrower } from '../../api/methods/methodDefinitions';
import { PROPERTY_CATEGORY } from '../../api/properties/propertyConstants';
import Calculator from '../../utils/Calculator';
import ConfirmMethod from '../ConfirmMethod';
import Icon from '../Icon';
import RadioTabs from '../RadioButtons/RadioTabs';
import Tabs from '../Tabs';
import T from '../Translation';
import VerticalAligner from '../VerticalAligner';
import FileTabLabel from './FileTabLabel';
import FileTabsContainer from './FileTabsContainer';
import LoanGoogleDrive from './LoanGoogleDrive';
import SingleFileTab from './SingleFileTab';
import ZipLoan from './ZipLoan';

const isPropertyFilesDisabled = (disabled, property) => {
  if (disabled) {
    return true;
  }

  if (Meteor.microservice === 'admin') {
    return false;
  }

  return property.category !== PROPERTY_CATEGORY.USER;
};

const FileTabs = ({ loan, disabled, currentUser }) => {
  const [basicOnly, setBasicOnly] = useState(false);
  const { borrowers, properties } = loan;
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <div className="files-tab">
      {isAdmin && <ZipLoan loan={loan} />}
      <div className={cx('files-tab-container', { admin: isAdmin })}>
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
                            <h1>
                              {borrower.name || (
                                <T
                                  id="general.borrowerWithIndex"
                                  values={{ index: index + 1 }}
                                />
                              )}
                            </h1>
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
                            loan={loan}
                            basicOnly={basicOnly}
                          />
                        </VerticalAligner>
                      </div>
                    ))}

                    {isAdmin && borrowers.length === 0 && (
                      <div>
                        <h3 className="secondary">
                          Pas encore d'emprunteur sur ce dossier
                        </h3>
                        <div>
                          <ConfirmMethod
                            method={() => addBorrower.run({ loanId: loan._id })}
                            label="Emprunteur"
                            buttonProps={{
                              raised: true,
                              primary: true,
                              style: { marginBottom: 16 },
                              icon: <Icon type="add" />,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ),
            },
            ...(!loan.hasPromotion && properties.length > 0
              ? properties
                  .filter(
                    ({ category }) =>
                      isAdmin || category !== PROPERTY_CATEGORY.PRO,
                  )
                  .map(property => ({
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
                        disabled={isPropertyFilesDisabled(disabled, property)}
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
                  disabled={disabled}
                  currentUser={currentUser}
                  loan={loan}
                  ignoreDocuments={['ADMIN']}
                />
              ),
            },
            ...(isAdmin
              ? [
                  {
                    label: (
                      <FileTabLabel
                        id="FileTabs.admin"
                        progress={{ percent: 1 }}
                      />
                    ),
                    content: (
                      <SingleFileTab
                        documentArray={[{ id: 'ADMIN' }]}
                        categories={{
                          ADMIN: {
                            documentsToDisplay: [{ id: 'ADMIN' }],
                            documentsToHide: [],
                          },
                        }}
                        withHiddenDocuments={false}
                        allowRequireByAdmin={false}
                        doc={loan}
                        disabled={disabled}
                        currentUser={currentUser}
                        loan={loan}
                        withAdditionalDocAdder={false}
                        handleSuccess={({ Key }) =>
                          setFileRoles.run({
                            Key,
                            roles: [FILE_ROLES.ADMIN],
                            docId: loan._id,
                            collection: loan._collection,
                          })
                        }
                      />
                    ),
                  },
                ]
              : []),
          ]}
          variant="scrollable"
          scrollButtons="auto"
        />

        {isAdmin && <LoanGoogleDrive loanId={loan._id} name={loan.name} />}
      </div>
    </div>
  );
};
FileTabs.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabsContainer(FileTabs);
