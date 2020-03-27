import React from 'react';

const InsuranceRequestBoardCardBottom = ({ customName }) => {
  let content = null;
  if (customName) {
    content = customName;
  }

  if (content) {
    return <div className="card-bottom">{content}</div>;
  }

  return null;
};

export default InsuranceRequestBoardCardBottom;
