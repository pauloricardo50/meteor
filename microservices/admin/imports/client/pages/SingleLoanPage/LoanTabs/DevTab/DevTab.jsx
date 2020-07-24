import React from 'react';

import JSONMarkdown from '../../../../components/JSONMarkdown';

const DevTab = ({ loan }) => (
  <div className="p-16">
    <JSONMarkdown object={loan} />
  </div>
);

export default DevTab;
