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

export default withProps(({ onEventScheduled }) => {
  const [scriptLoaded, setScriptLoaded] = useState(
    !!document.querySelector(`script[src="${SCRIPT_SOURCE}"]`),
  );
  useEffect(() => {
    const callback = makeOnEventScheduled(onEventScheduled);
    window.addEventListener('message', callback);
    return () => window.removeEventListener('message', callback);
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
  };
});
