import React from 'react';

import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import StatusLabel from 'core/components/StatusLabel';
import T from 'core/components/Translation';

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
