// @flow
import React from 'react';

type HtmlPreviewProps = {
  value: String,
};

const HtmlPreview = ({ value }: HtmlPreviewProps) => (
  <div dangerouslySetInnerHTML={{ __html: value }} />
);

export default HtmlPreview;
