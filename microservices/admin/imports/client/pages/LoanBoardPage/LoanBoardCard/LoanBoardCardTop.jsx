// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';

import { LOANS_COLLECTION } from 'core/api/constants';
import { getLoanLinkTitle } from 'core/components/IconLink/collectionIconLinkHelpers';
import StatusLabel from 'core/components/StatusLabel';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  admins,
  borrowers,
  hasRenderedComplexOnce,
  loanId,
  name,
  renderComplex,
  status,
  user,
}: LoanBoardCardTopProps) => {
  const userId = user && user._id;
  const hasUser = !!userId;
  const title = getLoanLinkTitle({ user, name, borrowers });

  return (
    <>
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={LOANS_COLLECTION}
          allowModify={renderComplex}
          docId={loanId}
          showTooltip={renderComplex}
        />

        <LoanBoardCardAssignee
          admins={admins}
          renderComplex={renderComplex}
          user={user}
        />

        {renderComplex ? (
          <LoanBoardCardTitle
            borrowers={borrowers}
            hasUser={hasUser}
            name={name}
            title={title}
            user={user}
          />
        ) : (
          <h4 className="title title-placeholder">{title}</h4>
        )}
      </div>

      <div className="right">
        {(renderComplex || hasRenderedComplexOnce) && (
          <LoanBoardCardActions loanId={loanId} />
        )}
      </div>
    </>
  );
};

export default compose(
  React.memo,
  lifecycle({
    componentWillReceiveProps({ renderComplex: nextRenderComplex }) {
      const { renderComplex } = this.props;
      if (!renderComplex && nextRenderComplex) {
        this.setState({ hasRenderedComplexOnce: true });
      }
    },
  }),
)(LoanBoardCardTop);
