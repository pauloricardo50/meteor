import React from 'react';

const HtmlPreview = ({ value }) => {
  if (typeof value === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return value;
};
export default HtmlPreview;
