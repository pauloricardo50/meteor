import { useEffect, useState } from 'react';
import { withProps } from 'recompose';

import useCurrentUser from '../../hooks/useCurrentUser';

const SCRIPT_SOURCE = 'https://assets.calendly.com/assets/external/widget.js';

const isCalendlyEvent = e => e?.data?.event?.indexOf('calendly') === 0;

const isEventScheduledEvent = e =>
  isCalendlyEvent(e) && e?.data?.event?.includes('event_scheduled');

const makeOnEventScheduled = onEventScheduled => e => {
  if (isEventScheduledEvent(e)) {
    onEventScheduled(e);
  }
};

export default withProps(({ onEventScheduled = () => ({}) }) => {
  const [scriptLoaded, setScriptLoaded] = useState(
    !!document.querySelector(`script[src="${SCRIPT_SOURCE}"]`),
  );

  useEffect(() => {
    const onEventScheduledCallback = makeOnEventScheduled(onEventScheduled);
    window.addEventListener('message', onEventScheduledCallback);
    return () =>
      window.removeEventListener('message', onEventScheduledCallback);
  });
  const currentUser = useCurrentUser();

  return {
    loadScript: () => {
      const script = document.createElement('script');
      script.src = SCRIPT_SOURCE;
      script.onload = () => setScriptLoaded(true);

      document.body.appendChild(script);
    },
    scriptLoaded,
    prefill: { name: currentUser?.name, email: currentUser?.email },
    styles: {
      zIndex: 2,
      minWidth: '320px',
      height: '630px',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
  };
});
