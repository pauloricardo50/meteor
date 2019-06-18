// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';

import { LOANS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';

type LoanBoardCardTopProps = {};

const getCardTitle = (user, name, borrowers = []) => {
  if (borrowers.length && borrowers[0].firstName) {
    return borrowers[0].name;
  }

  if (user && user.firstName) {
    return [user.firstName, user.lastName].filter(x => x).join(' ');
  }

  return name;
};

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
  const title = getCardTitle(user, name, borrowers);

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
