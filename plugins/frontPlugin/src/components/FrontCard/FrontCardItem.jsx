import React from 'react';
import cx from 'classnames';

const FrontCardItem = ({ label, data, dataOnClick }) => (
  <div className="front-card-item">
    <h4>{label}</h4>
    <span
      className={cx({ link: dataOnClick })}
      onClick={() => dataOnClick && dataOnClick()}
    >
      {data}
    </span>
  </div>
);

export default FrontCardItem;
