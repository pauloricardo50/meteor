import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Uploader,
  FileStatusIcon,
} from '/imports/ui/components/general/UploaderArray';

const ClosingItem = ({ step, loanRequest, disabled }) => {
  const { type, title, description, status, error, id } = step;

  if (type === 'upload') {
    return (
      <Uploader
        fileMeta={{ id, title }}
        currentValue={loanRequest.files[id]}
        docId={loanRequest._id}
        disabled={disabled}
      />
    );
  }
  return (
    <div
      className={classNames({ 'mask1 flex-col': true, secondary: disabled })}
      style={{ marginBottom: 16, width: '100%' }}
    >
      <div className="flex" style={{ alignItems: 'center' }}>
        <FileStatusIcon status={status} />
        <h4 className="title no-margin">{title}</h4>
      </div>
      <p className="secondary" style={{ paddingTop: 8 }}>
        {description}
      </p>
      {error && (
        <div
          style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid grey' }}
        >
          <p className="warning">{error}</p>
        </div>
      )}
    </div>
  );
};

ClosingItem.propTypes = {};

export default ClosingItem;
