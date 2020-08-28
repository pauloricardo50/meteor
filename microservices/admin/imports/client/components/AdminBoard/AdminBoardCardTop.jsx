import React from 'react';
import { compose, lifecycle } from 'recompose';

import { loanSetStatus } from 'core/api/loans/methodDefinitions';
import StatusLabel from 'core/components/StatusLabel';

import AdminBoardCardAssignee from './AdminBoardCardAssignee';

const AdminBoardCardTop = ({
  hasRenderedComplexOnce,
  renderComplex,
  additionalActions,
  data,
  boardCardTopContent: {
    left: BoardCardTopContentLeft = () => null,
    right: BoardCardTopContentRight = () => null,
    makeStatusLabelProps = () => {},
  } = {},
  ...props
}) => {
  const { _id: docId, status, assigneeLinks, _collection } = data;

  return (
    <>
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={_collection}
          allowModify={renderComplex}
          docId={docId}
          showTooltip={renderComplex}
          method={nextStatus =>
            loanSetStatus.run({ loanId, status: nextStatus })
          }
          additionalActions={additionalActions}
          {...makeStatusLabelProps({ data })}
        />

        <AdminBoardCardAssignee
          renderComplex={renderComplex}
          assigneeLinks={assigneeLinks}
        />

        <BoardCardTopContentLeft
          renderComplex={renderComplex}
          data={data}
          {...props}
        />
      </div>

      <div className="right">
        <BoardCardTopContentRight
          data={data}
          renderComplex={renderComplex}
          hasRenderedComplexOnce={hasRenderedComplexOnce}
          {...props}
        />
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
)(AdminBoardCardTop);
