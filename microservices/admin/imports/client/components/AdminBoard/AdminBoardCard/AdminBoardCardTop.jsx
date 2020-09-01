import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';

import StatusLabel from 'core/components/StatusLabel';

import AdminBoardCardAssignee from './AdminBoardCardAssignee';

const AdminBoardCardTop = ({
  renderComplex,
  additionalActions,
  data,
  boardCardTopContent: {
    left: BoardCardTopContentLeft = () => null,
    right: BoardCardTopContentRight = () => null,
    makeStatusLabelProps = () => {},
    method = () => Promise.resolve(),
  } = {},
  ...props
}) => {
  const [hasRenderedComplexOnce, setHasRenderedComplexOnce] = useState();

  useEffect(() => {
    if (!hasRenderedComplexOnce && renderComplex) {
      setHasRenderedComplexOnce(true);
    }
  }, [renderComplex]);

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
          method={method}
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

export default React.memo(AdminBoardCardTop);
