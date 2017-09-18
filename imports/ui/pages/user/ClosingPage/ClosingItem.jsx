import React from 'react';
import PropTypes from 'prop-types';

import {
  Uploader,
  FileStatusIcon,
} from '/imports/ui/components/general/UploaderArray';

const ClosingItem = ({ step, loanRequest }) => {
  const { type, title, description, status, id } = step;

  if (type === 'upload') {
    return (
      <Uploader
        fileMeta={{ id, title }}
        currentValue={loanRequest.files[id]}
        docId={loanRequest._id}
      />
    );
  }
  return (
    <div className="mask1 flex-col" style={{ marginBottom: 16, width: '100%' }}>
      <div className="flex" style={{ alignItems: 'center' }}>
        <FileStatusIcon status={status} />
        <h4 className="title no-margin">{title}</h4>
      </div>
      <p className="secondary" style={{ paddingTop: 8 }}>
        {description}
      </p>
    </div>
  );
};

ClosingItem.propTypes = {};

export default ClosingItem;
