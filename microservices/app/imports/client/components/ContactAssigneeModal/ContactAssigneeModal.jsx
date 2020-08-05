import React from 'react';

import { USER_STATUS } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import Button from 'core/components/Button';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';

const ContactAssigneeModal = ({ renderTrigger }) => {
  const currentUser = useCurrentUser();

  if (!currentUser?._id || currentUser.status === USER_STATUS.QUALIFIED) {
    return null;
  }

  let image = '/img/epotek-logo.png';
  const email = 'team@e-potek.ch';
  let phone = '+41 22 566 01 10';
  let calendlySlug = 'epotek-geneve';
  let assigneeName = 'attitré';

  if (currentUser?.assignedEmployee?._id) {
    const admin = employeesById[currentUser.assignedEmployee._id];
    image = admin.src;
    phone = admin.phoneNumber;
    calendlySlug = `epotek-${admin.email.split('@')[0]}`;
    assigneeName = admin.name;
  }

  return (
    <DialogSimple
      title={<T id="ContactAssigneeModal.title" />}
      text={
        <T
          id="ContactAssigneeModal.description"
          values={{ assigneeName: <b>{assigneeName}</b> }}
        />
      }
      renderTrigger={renderTrigger}
      closeOnly
      maxWidth="xs"
    >
      <div className="contact-assignee-modal flex-col">
        <img src={image} alt={assigneeName} />

        <div className="contact-assignee-modal-options">
          <Button
            primary
            variant="outlined"
            style={{ alignSelf: 'center' }}
            Component="a"
            href={`https://www.calendly.com/${calendlySlug}`}
            target="_new"
          >
            <Icon type="event" />
            <div className="button-content">
              <T id="ContactAssigneeModal.bookMeeting" />
              <span className="secondary">
                <T id="ContactAssigneeModal.bookMeetingDescription" />
              </span>
            </div>
          </Button>

          <div className="secondary" style={{ alignSelf: 'center' }}>
            <T id="ContactAssigneeModal.or" />
          </div>

          <div>
            <T id="ContactAssigneeModal.byEmail" /> :{' '}
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div>
            <T id="ContactAssigneeModal.byPhone" /> :{' '}
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        </div>
      </div>
    </DialogSimple>
  );
};

export default ContactAssigneeModal;
