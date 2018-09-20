// @flow
import React from 'react';

import T, { Percent } from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';

type FileTabLabelProps = {};

const FileTabLabel = ({ id, title, progress }: FileTabLabelProps) => (
  <span className="file-tab-label">
    {title || <T id={id} />}
    &nbsp; &bull; &nbsp;
    <PercentWithStatus
      value={progress}
      status={progress < 1 ? null : undefined}
      rounded
    />
  </span>
);

export default FileTabLabel;
