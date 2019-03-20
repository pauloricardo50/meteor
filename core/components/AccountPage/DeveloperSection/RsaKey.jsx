// @flow
import React from 'react';

type RsaKeyProps = {
  keyValue: String,
  hide: boolean,
};

const RsaKey = ({ keyValue, hide }: RsaKeyProps) =>
  (hide ? null : <textarea className="rsa-key" value={keyValue} disabled />);

export default RsaKey;
