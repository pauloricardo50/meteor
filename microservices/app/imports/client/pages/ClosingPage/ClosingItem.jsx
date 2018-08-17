import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FileStatusIcon, Uploader } from 'core/components/UploaderArray';
import {
  CLOSING_STEPS_STATUS,
  CLOSING_STEPS_TYPE,
  LOANS_COLLECTION,
} from 'core/api/constants';

const ClosingItem = ({ step, loan, disabled }) => {
  const { type, title, description, status, error, id } = step;

  if (type === CLOSING_STEPS_TYPE.UPLOAD) {
    return (
      <Uploader
        fileMeta={{ id, title }}
        currentValue={loan.documents[id]}
        docId={loan._id}
        disabled={disabled}
        label={title}
        collection={LOANS_COLLECTION}
      />
    );
  }

  return (
    <div
      className={classNames('card1 card-top flex-col', {
        secondary: disabled,
      })}
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
      {status === CLOSING_STEPS_STATUS.ERROR
        && error && (
        <div style={{ marginTop: 8, paddingTop: 8 }} className="border top">
          <p className="error">{error}</p>
        </div>
      )}
    </div>
  );
};

ClosingItem.propTypes = {
  disabled: PropTypes.bool,
  loan: PropTypes.object.isRequired,
  step: PropTypes.object.isRequired,
};

export default ClosingItem;
