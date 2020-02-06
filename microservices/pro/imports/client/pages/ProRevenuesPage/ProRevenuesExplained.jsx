import React from 'react';

import T from 'core/components/Translation';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import StatusLabel from 'core/components/StatusLabel';
import { LOAN_STATUS } from 'core/api/constants';
import { LOANS_COLLECTION } from 'imports/core/api/constants';

const ProRevenuesPageExplained = () => (
  <DialogSimple
    buttonProps={{
      label: <T id="ProRevenuesPage.explained" />,
      primary: true,
      raised: false,
      icon: <Icon type="help" />,
      iconAfter: true,
      className: 'explained',
    }}
    title={<T id="ProRevenuesPage.explained" />}
    closeOnly
  >
    <T
      id="ProRevenuesPage.explained1"
      values={{
        lead: (
          <StatusLabel
            status={LOAN_STATUS.LEAD}
            collection={LOANS_COLLECTION}
          />
        ),
        qualifiedLead: (
          <StatusLabel
            status={LOAN_STATUS.QUALIFIED_LEAD}
            collection={LOANS_COLLECTION}
          />
        ),
        ongoing: (
          <StatusLabel
            status={LOAN_STATUS.ONGOING}
            collection={LOANS_COLLECTION}
          />
        ),
        closing: (
          <StatusLabel
            status={LOAN_STATUS.CLOSING}
            collection={LOANS_COLLECTION}
          />
        ),
      }}
    />
  </DialogSimple>
);

export default ProRevenuesPageExplained;
