import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

const willEnter = () => ({
  opacity: 0,
  scale: 0.98,
});

const willLeave = () => ({
  opacity: spring(0),
  scale: spring(1),
});

const getStyles = () => ({
  opacity: spring(1),
  scale: spring(1),
});

const RouteTransition = ({ children: child, pathname }) => (
  <TransitionMotion
    styles={[
      {
        key: pathname,
        style: getStyles(),
        data: { child },
      },
    ]}
    willEnter={willEnter}
    willLeave={willLeave}
  >
    {interpolated => (
      <div>
        {interpolated.map(({ key, style, data }) => (
          <div
            key={`${key}-transition`}
            style={{
              opacity: style.opacity,
              transform: `scale(${style.scale})`,
            }}
            className="transition-wrapper"
          >
            {data.child}
          </div>
        ))}
      </div>
    )}
  </TransitionMotion>
);

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
  },
};

export default RouteTransition;
