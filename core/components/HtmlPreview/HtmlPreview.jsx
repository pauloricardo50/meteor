// @flow
import React from 'react';

type HtmlPreviewProps = {
  value: String,
};

const HtmlPreview = ({ value }: HtmlPreviewProps) => {
  if (typeof value === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return value;
};
export default HtmlPreview;
