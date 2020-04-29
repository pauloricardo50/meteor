import React, { useState } from 'react';

import colors from '../../config/colors';
import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import CalendlyInline from '../Calendly/CalendlyInline';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import T from '../Translation';

const CALENDLY_EVENT_SCHEDULED = 'calendly_event_scheduled';

let sessionStorage;
if (typeof window === undefined) {
  sessionStorage = null;
} else {
  sessionStorage = window?.sessionStorage;
}

const makeCloseModal = ({
  onClose,
  setEventScheduled,
  setCalendlyLink,
}) => () => {
  if (sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === 'true') {
    setEventScheduled(true);
  }
  setCalendlyLink(undefined);
  onClose();
};

const OfficeChooser = ({ setCalendlyLink }) => (
  <div className="flex-col center">
    <Icon
      type="event"
      style={{ width: '100px', height: '100px', color: 'rgba(0,0,0,0.1)' }}
    />
    <h3>
      <T id="CalendlyModal.officeChooser.title" />
    </h3>
    <p className="description">
      <T id="CalendlyModal.officeChooser.description" />
    </p>
    <div className="flex mb-16 mt-16 space-children center">
      <Button
        onClick={() => setCalendlyLink('https://calendly.com/epotek-geneve')}
        label="e-Potek Genève"
        raised
        primary
      />
      <Button
        onClick={() => setCalendlyLink('https://calendly.com/epotek-lausanne')}
        label="e-Potek Lausanne"
        raised
        primary
      />
    </div>
  </div>
);

const EventScheduled = ({ setEventScheduled }) => (
  <div className="flex-col center">
    <Icon
      type="eventAvailable"
      style={{ width: '100px', height: '100px', color: colors.success }}
    />
    <h3>
      <T id="CalendlyModal.eventScheduled.title" />
    </h3>
    <p className="description">
      <T id="CalendlyModal.eventScheduled.description" />
    </p>
    <Button
      onClick={() => setEventScheduled(false)}
      label={<T id="CalendlyModal.eventScheduled.button" />}
      icon={<Icon type="add" />}
      secondary
      raised
    />
  </div>
);

const CalendlyModal = props => {
  const { link, open, onClose } = props;
  const [eventScheduled, setEventScheduled] = useState(
    sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === 'true',
  );
  const [buttonProps, setButtonProps] = useState({ primary: true });
  const [calendlyLink, setCalendlyLink] = useState(link);
  const fullScreen = useMedia({ maxWidth: 768 });

  const closeModal = makeCloseModal({
    onClose,
    setEventScheduled,
    setCalendlyLink,
  });
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      title={<T id="CalendlyModal.title" />}
      actions={
        <Button
          onClick={closeModal}
          label={<T id="general.close" />}
          raised
          {...buttonProps}
        />
      }
      open={open}
      onClose={closeModal}
    >
      {eventScheduled ? (
        <EventScheduled setEventScheduled={setEventScheduled} />
      ) : calendlyLink ? (
        <CalendlyInline
          url={calendlyLink}
          onEventScheduled={() => {
            sessionStorage?.setItem(CALENDLY_EVENT_SCHEDULED, 'true');
            setButtonProps({ secondary: true });
          }}
        />
      ) : (
        <OfficeChooser setCalendlyLink={setCalendlyLink} />
      )}
    </Dialog>
  );
};

export default CalendlyModal;
