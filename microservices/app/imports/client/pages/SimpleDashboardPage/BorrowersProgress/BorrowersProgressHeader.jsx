// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { createRoute } from 'core/utils/routerUtils';
import Button from 'core/components/Button';
import { BORROWERS_PAGE_NO_TAB } from '../../../../startup/client/appRoutes';

type BorrowersProgressHeaderProps = {};

const BorrowersProgressHeader = ({
  loanId,
  progress,
}: BorrowersProgressHeaderProps) => (
  <div className="borrowers-progress-cta">
    <span className="secondary">
      <T
        id="BorrowersProgress.progress"
        values={{
          percent: (
            <>
                &nbsp;
              <PercentWithStatus
                value={progress}
                status={progress < 1 ? null : undefined}
                rounded
              />
            </>
          ),
        }}
      />
    </span>

    <Button
      raised={progress < 1}
      primary
      link
      to={createRoute(BORROWERS_PAGE_NO_TAB, { loanId })}
    >
      <T id={progress < 1 ? 'general.continue' : 'general.modify'} />
    </Button>
  </div>
);
export default BorrowersProgressHeader;
