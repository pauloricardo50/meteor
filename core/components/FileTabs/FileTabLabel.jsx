// @flow
import React from 'react';

import T, { Percent } from 'core/components/Translation';

type FileTabLabelProps = {};

const FileTabLabel = ({ id, title, progress }: FileTabLabelProps) => (
  <span>
    {title || <T id={id} />}
    &nbsp; &bull; &nbsp;
    <Percent value={progress} />
  </span>
);

export default FileTabLabel;
