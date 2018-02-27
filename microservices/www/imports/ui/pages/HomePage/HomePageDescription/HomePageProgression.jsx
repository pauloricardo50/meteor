import React from 'react';

const dots = [1, 2, 3];
const dashes = [1, 2, 3, 4, 5, 6, 7];

const HomePageProgression = () => (
  <div className="progression">
    {dots.map(dot => (
      <span key={dot} className="segment">
        <span className="dot" />
        {dashes.map(dash => <span className="dash" key={dash} />)}
      </span>
    ))}
    <span className="dot" />
  </div>
);

export default HomePageProgression;
