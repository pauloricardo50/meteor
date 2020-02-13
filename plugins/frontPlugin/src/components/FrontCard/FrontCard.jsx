import React, { useState } from 'react';

import Icon from '../../core/components/Icon';

const FrontCard = props => {
  const { expanded = false, icon, title, children, subtitle } = props;
  const [expand, setExpand] = useState(expanded);

  return (
    <div className="front-card">
      <div className="front-card-top" onClick={() => setExpand(!expand)}>
        <div className="title">
          <Icon type={icon} className="icon" />
          <h3>{title}</h3>
          {subtitle && <span className="subtitle secondary">{subtitle}</span>}
        </div>
        <Icon type={expand ? 'expandLess' : 'expandMore'} className="icon" />
      </div>
      {!!expand && <div className="front-card-content">{children}</div>}
    </div>
  );
};

export default FrontCard;
