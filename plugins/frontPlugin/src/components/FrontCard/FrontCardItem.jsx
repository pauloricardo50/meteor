import React from 'react';
import cx from 'classnames';

const FrontCardItem = ({ label, children, onClick }) => (
  <div className="front-card-item">
    <h4>{label}</h4>
    <span
      className={cx({ link: onClick })}
      onClick={() => onClick && onClick()}
    >
      {children}
    </span>
  </div>
);

export default FrontCardItem;
