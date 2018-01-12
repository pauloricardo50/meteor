import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Uploader, FileStatusIcon } from 'core/components/UploaderArray';

const ClosingItem = ({ step, loanRequest, disabled }) => {
  const {
    type, title, description, status, error, id,
  } = step;

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
      style={{ marginBottom: 16, width: '100%', maxWidth: 600 }}
    >
      <div
        className="flex"
        style={{ alignItems: 'center', flexWrap: 'nowrap' }}
      >
        <FileStatusIcon status={status} />
        <h4 className="title no-margin">{title}</h4>
      </div>
      <p className="secondary" style={{ paddingTop: 8 }}>
        {description}
      </p>
      {status === 'error' &&
        error && (
          <div style={{ marginTop: 8, paddingTop: 8 }} className="border top">
            <p className="error">{error}</p>
          </div>
        )}
    </div>
  );
};

ClosingItem.propTypes = {};

export default ClosingItem;
