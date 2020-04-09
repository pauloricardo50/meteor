import React, { useState } from 'react';

import colors from '../../config/colors';
import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import CalendlyInline from '../Calendly/CalendlyInline';
import Icon from '../Icon'
import Dialog from '../Material/Dialog';

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
      title="Programmer un rendez-vous"
      actions={[<Button onClick={closeModal} label="Fermer" raised {...buttonProps} />]}
      open={open}
      onClose={closeModal}
    >
      {eventScheduled ?
        <div className="flex-col center">
          <Icon type="eventAvailable" style={{ width: '100px', height: '100px', color: colors.success }} />
          <h3>Vous avez déjà programmé un rendez-vous</h3>
          <p className="description">Voulez-vous en programmer un autre ?</p>
          <Button
            onClick={() => setEventScheduled(false)}
            label="Rendez-vous"
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
