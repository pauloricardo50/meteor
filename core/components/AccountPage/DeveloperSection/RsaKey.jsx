import React from 'react';

const RsaKey = ({ keyValue, hide }) =>
  hide ? null : <textarea className="rsa-key" value={keyValue} disabled />;

export default RsaKey;
