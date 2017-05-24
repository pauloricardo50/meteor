import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';

import { requestFiles, borrowerFiles } from '/imports/js/arrays/files';

const FileTabs = props => (
  <Tabs>
    {props.borrowers.map(b => (
      <Tab label={b.firstName} key={b._id}>
        <div style={{ margin: '40px 0' }}>
          <DropzoneArray
            array={borrowerFiles(b).contract}
            documentId={b._id}
            pushFunc="pushBorrowerValue"
            collection="borrowers"
            filesObject={b.files}
            filesObjectSelector="files"
          />
        </div>
      </Tab>
    ))}
    <Tab label="Bien immobilier">
      <div style={{ margin: '40px 0' }}>
        <DropzoneArray
          array={requestFiles(props.loanRequest).contract}
          documentId={props.loanRequest._id}
          pushFunc="pushRequestValue"
          collection="loanRequests"
          filesObject={props.loanRequest.files}
          filesObjectSelector="files"
        />
      </div>
    </Tab>
  </Tabs>
);

FileTabs.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabs;
