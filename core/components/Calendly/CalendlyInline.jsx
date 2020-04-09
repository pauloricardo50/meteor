import React, { useEffect, useState } from 'react';

import CalendlyContainer from './CalendlyContainer';

const defaultStyles = {
  minWidth: '320px',
  height: '630px',
};

const CalendlyInline = ({ url, scriptLoaded, loadScript, styles, onEventScheduled = () => ({}), prefill }) => {
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
      style={styles || defaultStyles}
      data-url={url}
      ref={parentContainerRef}
    />
  );

}

export default CalendlyContainer(CalendlyInline);
