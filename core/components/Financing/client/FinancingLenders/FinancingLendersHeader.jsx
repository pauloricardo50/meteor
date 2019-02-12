// @flow
import React from 'react';

type MyComponentProps = {};

const MyComponent = ({ lenders = [] }: MyComponentProps) => (
  <div className="lenders">{lenders.length} Prêteurs intéressés</div>
);

export default MyComponent;
