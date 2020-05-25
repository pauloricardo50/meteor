import React from 'react';
import { faInbox } from '@fortawesome/pro-light-svg-icons/faInbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import T from '../../Translation';

const TableEmpty = () => (
  <div className="secondary flex-col center" data-testid="empty-table">
    <FontAwesomeIcon
      icon={faInbox}
      size="4x"
      style={{ padding: 16, paddingBottom: 4 }}
    />
    <span className="mb-8 font-size-3">
      <T id="Table.empty" />
    </span>
  </div>
);

export default TableEmpty;
