import React from 'react';
import PropTypes from 'prop-types';

const CheckMailboxPage = ({
  match: {
    params: { email },
  },
}) => (
  <div className="check-mailbox-page">
    <h1>Email envoyé à {email}</h1>
    <h3>Consultez votre boite mail pour continuer votre expérience e-Potek</h3>
  </div>
);

CheckMailboxPage.propTypes = {};

export default CheckMailboxPage;
