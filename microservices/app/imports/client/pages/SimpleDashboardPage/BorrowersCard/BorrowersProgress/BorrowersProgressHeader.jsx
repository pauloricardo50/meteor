// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { createRoute } from 'core/utils/routerUtils';
import Button from 'core/components/Button';
import APP_ROUTES from '../../../../../startup/client/appRoutes';

type BorrowersProgressHeaderProps = {};

const BorrowersProgressHeader = ({
  loanId,
  progress,
  setOpenBorrowersForm,
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
      onClick={() => setOpenBorrowersForm(true)}
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
