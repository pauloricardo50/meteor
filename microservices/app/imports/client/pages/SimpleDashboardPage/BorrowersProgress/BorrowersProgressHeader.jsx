// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { createRoute } from 'core/utils/routerUtils';
import Button from 'core/components/Button';
import ROUTES from '../../../../startup/client/appRoutes';

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
      secondary={progress < 1}
      primary={progress >= 1}
      link
      to={createRoute(ROUTES.BORROWERS_PAGE_NO_TAB.path, { loanId })}
    >
      <T
        id={
          progress < 1
            ? progress === 0
              ? 'general.start'
              : 'general.continue'
            : 'general.modify'
        }
      />
    </Button>
  </div>
);
export default BorrowersProgressHeader;
