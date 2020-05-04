import React, { useContext } from 'react';
import { compose, lifecycle } from 'recompose';

import { loanSetStatus } from 'core/api/loans/methodDefinitions';
import { getLoanLinkTitle } from 'core/components/IconLink/collectionIconLinkHelpers';
import { ModalManagerContext } from 'core/components/ModalManager';
import StatusLabel from 'core/components/StatusLabel';

import LoanStatusModifierContainer from '../../../SingleLoanPage/LoanStatusModifier/LoanStatusModifierContainer';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';
import LoanBoardCardTitle from './LoanBoardCardTitle';

const LoanBoardCardTop = ({
  hasRenderedComplexOnce,
  renderComplex,
  additionalActions,
  loan,
}) => {
  const {
    borrowers,
    _id: loanId,
    name,
    status,
    user,
    assigneeLinks,
    _collection,
  } = loan;
  const userId = user?._id;
  const hasUser = !!userId;
  const title = getLoanLinkTitle({ user, name, borrowers });
  const { openModal } = useContext(ModalManagerContext);

  return (
    <>
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={_collection}
          allowModify={renderComplex}
          docId={loanId}
          showTooltip={renderComplex}
          method={nextStatus =>
            loanSetStatus.run({ loanId, status: nextStatus })
          }
          additionalActions={additionalActions(openModal)}
        />

        <LoanBoardCardAssignee
          renderComplex={renderComplex}
          assigneeLinks={assigneeLinks}
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
          <div className="title font-size-body">
            <span className="title-placeholder">{title}</span>
          </div>
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
    UNSAFE_componentWillReceiveProps({ renderComplex: nextRenderComplex }) {
      const { renderComplex } = this.props;
      if (!renderComplex && nextRenderComplex) {
        this.setState({ hasRenderedComplexOnce: true });
      }
    },
  }),
  LoanStatusModifierContainer,
)(LoanBoardCardTop);
