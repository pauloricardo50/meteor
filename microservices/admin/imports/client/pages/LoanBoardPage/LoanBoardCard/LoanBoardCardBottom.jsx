// @flow
import React from 'react';

type LoanBoardCardBottomProps = {};

const LoanBoardCardBottom = ({
  promotions,
  properties,
  customName,
  structure,
}: LoanBoardCardBottomProps) => {
  const promotion = promotions[0] && promotions[0].name;

  let content;
  if (promotion) {
    content = promotion;
  } else if (customName) {
    content = customName;
  } else if (structure.propertyId) {
    const property = properties.find(({ _id }) => _id === structure.propertyId);
    if (property.address1) {
      content = property.address1;
    }
  }

  if (content) {
    return <div className="card-bottom">{content}</div>;
  }

  return null;
};

export default LoanBoardCardBottom;
