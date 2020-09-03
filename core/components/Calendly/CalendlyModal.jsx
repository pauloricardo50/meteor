import React, { useState } from 'react';

import { employeesById } from 'core/arrays/epotekEmployees';
import useCurrentUser from 'core/hooks/useCurrentUser';

import colors from '../../config/colors';
import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import T from '../Translation';
import CalendlyInline from './CalendlyInline';
import CalendlyModalOfficePicker from './CalendlyModalOfficePicker';

const CALENDLY_EVENT_SCHEDULED = 'calendly_event_scheduled';

let sessionStorage;
if (typeof window === 'undefined') {
  sessionStorage = null;
} else {
  sessionStorage = window.sessionStorage;
}

const CalendlyModal = ({ buttonProps }) => {
  const currentUser = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState(
    currentUser?._id &&
      employeesById[currentUser.assignedEmployee?._id]?.calendly,
  );
  const [eventScheduled, setEventScheduled] = useState(
    sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === 'true',
  );
  const [actionButtonProps, setActionButtonProps] = useState({ primary: true });
  const fullScreen = useMedia({ maxWidth: 768 });

  const closeModal = () => {
    if (sessionStorage?.getItem(CALENDLY_EVENT_SCHEDULED) === 'true') {
      setEventScheduled(true);
    }
    setOpen(false);
    if (!currentUser) {
      // Reset office selection when closing the modal
      setCalendlyLink(undefined);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} {...buttonProps} />
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        title={<T id="CalendlyModal.title" />}
        actions={[
          <Button
            key="close"
            onClick={closeModal}
            label={<T id="general.close" />}
            raised
            {...actionButtonProps}
          />,
        ]}
        open={open}
        onClose={closeModal}
      >
        {!calendlyLink && (
          <CalendlyModalOfficePicker setLink={setCalendlyLink} />
        )}

        {calendlyLink && eventScheduled ? (
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
        ) : null}

        {calendlyLink && !eventScheduled ? (
          <CalendlyInline
            url={calendlyLink}
            onEventScheduled={() => {
              sessionStorage?.setItem(CALENDLY_EVENT_SCHEDULED, 'true');
              setActionButtonProps({ secondary: true });
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
};

export default CalendlyModal;
