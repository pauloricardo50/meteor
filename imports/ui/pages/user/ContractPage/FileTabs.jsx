import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

// import DropzoneArray from '/imports/ui/components/general/DropzoneArray';
import UploaderArray from '/imports/ui/components/general/UploaderArray';

import { requestFiles, borrowerFiles } from '/imports/js/arrays/files';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FileTabs = props =>
  (<div>
    <Tabs defaultActiveKey={1} id="tabs">
      <Tab eventKey={1} title="Bien Immobilier">
        <div style={styles.tabContent}>
          <UploaderArray
            fileArray={requestFiles(props.loanRequest).contract}
            doc={props.loanRequest}
          />
          {/* <DropzoneArray
            array={requestFiles(props.loanRequest).contract}
            documentId={props.loanRequest._id}
            pushFunc="pushRequestValue"
            updateFunc="updateRequest"
            collection="loanRequests"
            filesObject={props.loanRequest.files}
            filesObjectSelector="files"
          /> */}
        </div>
      </Tab>
      {props.borrowers.map((b, index) =>
        (<Tab eventKey={index + 2} title={b.firstName} key={b._id}>
          <div style={styles.tabContent}>
            <UploaderArray fileArray={borrowerFiles(b).contract} doc={b} />

            {/* <DropzoneArray
              array={borrowerFiles(b).contract}
              documentId={b._id}
              pushFunc="pushBorrowerValue"
              updateFunc="updateBorrower"
              collection="borrowers"
              filesObject={b.files}
              filesObjectSelector="files"
            /> */}
          </div>
        </Tab>),
      )}
    </Tabs>
  </div>);

FileTabs.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabs;
