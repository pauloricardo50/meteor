import React, { useState } from 'react';

const AdminBoardCard = ({
  setDocId,
  boardCardContent: BoardCardContent,
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
      <BoardCardContent data={data} renderComplex={renderComplex} {...props} />
    </div>
  );
};

export default AdminBoardCard;
