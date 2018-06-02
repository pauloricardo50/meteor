import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import ConfirmButton from '../../components/ConfirmButton';
import VerificationRequested from './VerificationRequested';

const VerificationStart = ({ verification, loanId, onClick }) => (
  <article>
    <div className="description">
      <p>
        <T id="VerificationPage.description" />
      </p>
    </div>
    {verification.requested ? (
      <VerificationRequested />
    ) : (
      <div
        className="text-center"
        style={{
          margin: '40px 0',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          raised
          label={<T id="general.cancel" />}
          link
          to={`/loans/${loanId}`}
          style={{ marginRight: 8 }}
        />
        <ConfirmButton
          raised
          label={<T id="VerificationPage.CTA" />}
          primary
          handleClick={onClick}
          text={<T id="VerificationPage.CTA.warning" />}
        />
      </div>
    )}
  </article>
);

VerificationStart.propTypes = {
  verification: PropTypes.object.isRequired,
  loanId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default VerificationStart;
