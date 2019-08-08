// @flow
import React, { useContext } from 'react';
import { compose, lifecycle } from 'recompose';

import { LOANS_COLLECTION } from 'core/api/constants';
import { getLoanLinkTitle } from 'core/components/IconLink/collectionIconLinkHelpers';
import StatusLabel from 'core/components/StatusLabel';
import { loanSetStatus } from 'core/api/loans/index';
import { ModalManagerContext } from 'core/components/ModalManager';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';
import LoanStatusModifierContainer from '../../SingleLoanPage/LoanStatusModifier/LoanStatusModifierContainer';

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
  additionalActions,
}: LoanBoardCardTopProps) => {
  const userId = user && user._id;
  const hasUser = !!userId;
  const title = getLoanLinkTitle({ user, name, borrowers });
  const { openModal } = useContext(ModalManagerContext);

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
          method={nextStatus =>
            loanSetStatus.run({ loanId, status: nextStatus })
          }
          additionalActions={additionalActions(openModal)}
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
  LoanStatusModifierContainer,
)(LoanBoardCardTop);
