import React, { useState } from 'react';

import colors from '../../config/colors';
import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import CalendlyInline from '../Calendly/CalendlyInline';
import Icon from '../Icon'
import Dialog from '../Material/Dialog';
import T from '../Translation';

const CALENDLY_EVENT_SCHEDULED = 'calendly_event_scheduled';

let sessionStorage;
if(typeof window === undefined){
  sessionStorage = null;
} else {
  sessionStorage = window.sessionStorage;
}

const makeCloseModal = ({onClose, setEventScheduled}) => () => {
  if (sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === "true") {
    setEventScheduled(true);
  }
  onClose();
}

const CalendlyModal = props => {
  const { link, open, onClose } = props;
  const [eventScheduled, setEventScheduled] = useState(sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === "true");
  const [buttonProps, setButtonProps] = useState({ primary: true });
  const fullScreen = useMedia({maxWidth: 768});

  const closeModal = makeCloseModal({onClose, setEventScheduled});
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      title={<T id="CalendlyModal.title" />}
      actions={[<Button onClick={closeModal} label={<T id="general.close" />} raised {...buttonProps} />]}
      open={open}
      onClose={closeModal}
    >
      {eventScheduled ?
        <div className="flex-col center">
          <Icon type="eventAvailable" style={{ width: '100px', height: '100px', color: colors.success }} />
          <h3><T id="CalendlyModal.eventScheduled.title" /></h3>
          <p className="description"><T id="CalendlyModal.eventScheduled.description" /></p>
          <Button
            onClick={() => setEventScheduled(false)}
            label={<T id="CalendlyModal.eventScheduled.button" />}
            icon={<Icon type="add" />}
            secondary
            raised
          />
        </div> :
        <CalendlyInline
          url={link}
          onEventScheduled={() => { sessionStorage?.setItem(CALENDLY_EVENT_SCHEDULED, "true"); setButtonProps({ secondary: true }) }}
        />
      }
    </Dialog>
  );
};

export default CalendlyModal;
