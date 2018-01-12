import React from 'react';
import PropTypes from 'prop-types';

import ConfirmButton from '/imports/ui/components/ConfirmButton';
import { T } from 'core/components/Translation';
import VerificationRequested from './VerificationRequested';

const VerificationFailed = ({ verification, onClick }) => (
  <div className="text-center animated fadeIn" style={{ margin: '40px 0' }}>
    <h1 className="warning">
      <T id="VerificationPage.failedTitle" /> <span className="fa fa-times" />
    </h1>
    <div className="description">
      <p>
        <T id="VerificationPage.failedDescription" />
      </p>
    </div>
    <ul style={{ margin: '20px 0' }} className="verification-comment-list">
      {verification.comments.length > 0 &&
        verification.comments
          .map((comment, i) => (
            <li key={i}>
              <h3>
                {i + 1}. {comment}
              </h3>
            </li>
          ))
          .reduce((prev, curr) => [prev, <hr key={prev.length} />, curr])}
    </ul>
    {verification.requested ? (
      <VerificationRequested />
    ) : (
      <div style={{ marginTop: 40 }}>
        <ConfirmButton
          raised
          label={<T id="VerificationPage.CTA2" />}
          primary
          handleClick={onClick}
        />
      </div>
    )}
  </div>
);

VerificationFailed.propTypes = {
  verification: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default VerificationFailed;
