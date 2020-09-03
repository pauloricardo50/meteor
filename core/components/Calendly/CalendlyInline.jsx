import React, { useEffect } from 'react';

import Loading from '../Loading';
import CalendlyContainer from './CalendlyContainer';

const defaultStyles = {
  minWidth: '320px',
  height: '630px',
};

const CalendlyInline = ({ url, scriptLoaded, loadScript, styles, prefill }) => {
  const parentContainerRef = React.createRef();

  useEffect(() => {
    if (!scriptLoaded) {
      loadScript();
    } else {
      window.Calendly.initInlineWidget({
        url,
        parentElement: parentContainerRef.current,
        prefill,
      });
    }
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '630px',
        minWidth: '320px',
      }}
    >
      <div
        style={styles || defaultStyles}
        data-url={url}
        ref={parentContainerRef}
      />
      <Loading
        style={{
          position: 'absolute',
          top: 'calc(50% - 50px)',
          left: 'calc(50% - 50px)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default CalendlyContainer(CalendlyInline);
