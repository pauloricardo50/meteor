import React from 'react';
import cx from 'classnames';

// http://codepen.io/TaniaLD/pen/oKxep
const Loading = ({ small, fullScreen }) => (
  // Fade it in so that the loader doesn't show up if loading is super fast
  <div className={cx('loading-container animated fadeIn', { small, fullScreen })}>
    <div className="loading-box">
      <div className="loader2" />
    </div>
  </div>
);

export default Loading;
