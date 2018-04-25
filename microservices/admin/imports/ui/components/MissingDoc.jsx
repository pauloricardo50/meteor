import React from 'react';

import LayoutError from 'core/components/ErrorBoundary/LayoutError';

const MissingDoc = () => (
  <LayoutError errorDescription="missingDoc" displayReloadButton={false} />
);

export default MissingDoc;
