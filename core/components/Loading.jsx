import React from 'react';

// http://codepen.io/TaniaLD/pen/oKxep
export const LoadingComponent = () => (
  // Fade it in so that the loader doesn't show up if loading is super fast
  <div className="loading-container animated fadeIn">
    <div className="loading-box">
      <div className="loader2" />
    </div>
  </div>
);

const options = {
  loadingHandler: LoadingComponent,
};

export default options;
