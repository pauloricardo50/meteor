import React, { useState } from 'react';

import AdminBoardCardContent from './AdminBoardCardContent';
import AdminBoardCardTop from './AdminBoardCardTop';

const AdminBoardCard = ({
  setDocId,
  boardCardContent: {
    top: boardCardTopContent,
    content: boardCardContent,
    bottom: BoardCardBottom = () => null,
  },
  style,
  data,
  ...props
}) => {
  const [renderComplex, setRenderComplex] = useState(false);

  return (
    <div
      className="admin-board-card card1 card-hover animated bounceIn"
      style={style}
      onClick={() => setDocId(data._id)}
      onMouseEnter={() => setRenderComplex(true)}
      onMouseLeave={() => setRenderComplex(false)}
    >
      <div className="card-header">
        <AdminBoardCardTop
          renderComplex={renderComplex}
          data={data}
          boardCardTopContent={boardCardTopContent}
          {...props}
        />
      </div>
      <div className="card-top">
        <AdminBoardCardContent
          data={data}
          renderComplex={renderComplex}
          boardCardContent={boardCardContent}
          {...props}
        />
      </div>
      <BoardCardBottom data={data} renderComplex={renderComplex} {...props} />
    </div>
  );
};

export default React.memo(AdminBoardCard);
