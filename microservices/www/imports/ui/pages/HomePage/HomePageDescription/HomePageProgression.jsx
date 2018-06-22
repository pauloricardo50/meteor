import React from 'react';

const dots = [...new Array(4)];
const dashes = [...new Array(20)];

const HomePageProgression = () => (
  <div className="progression">
    {dots.map((dot, dotIndex) => (
      <span key={dotIndex} className="segment">
        <span className="dot" />
        {dashes.map((dash, dashIndex) =>
          <span className="dash" key={dashIndex} />)}
      </span>
    ))}
    <span className="dot" />
  </div>
);

export default HomePageProgression;
