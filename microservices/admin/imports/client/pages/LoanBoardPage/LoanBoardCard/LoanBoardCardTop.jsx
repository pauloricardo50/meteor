// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';

import { LOANS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  admins,
  loanId,
  name,
  status,
  user,
  renderComplex,
  hasRenderedComplexOnce,
}: LoanBoardCardTopProps) => {
  const userId = user && user._id;
  const hasUser = !!userId;
  const title = user && user.firstName
    ? [user.firstName, user.lastName].filter(x => x).join(' ')
    : name;

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
          renderComplex={renderComplex}
          user={user}
          admins={admins}
        />

        {renderComplex ? (
          <LoanBoardCardTitle
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
