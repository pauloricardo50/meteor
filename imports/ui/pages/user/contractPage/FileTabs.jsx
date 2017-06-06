import React from 'react';
import PropTypes from 'prop-types';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';

import { requestFiles, borrowerFiles } from '/imports/js/arrays/files';

const FileTabs = props =>
  <div>
    {props.borrowers.map(b =>
      <div style={{ margin: '40px 0' }} key={b._id}>
        <h2 className="text-center">{b.firstName}</h2>
        <DropzoneArray
          array={borrowerFiles(b).contract}
          documentId={b._id}
          pushFunc="pushBorrowerValue"
          updateFunc="updateBorrower"
          collection="borrowers"
          filesObject={b.files}
          filesObjectSelector="files"
        />
      </div>,
    )}
    <div style={{ margin: '40px 0' }}>
      <h2 className="text-center">Bien Immobilier</h2>
      <DropzoneArray
        array={requestFiles(props.loanRequest).contract}
        documentId={props.loanRequest._id}
        pushFunc="pushRequestValue"
        updateFunc="updateRequest"
        collection="loanRequests"
        filesObject={props.loanRequest.files}
        filesObjectSelector="files"
      />
    </div>
  </div>;

FileTabs.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileTabs;
