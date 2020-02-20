import React from 'react';
import moment from 'moment';

import FrontCard from '../FrontCard/FrontCard';
import FrontCardItem from '../FrontCard/FrontCardItem';
import FrontContactTasks from './FrontContactTasks/FrontContactTasks';
import T from '../../core/components/Translation';
import { employeesById } from '../../core/arrays/epotekEmployees';

const { Front, subdomains } = window;

const getContactTitle = props => {
  const { contact, collection, isEpotekResource } = props;
  if (!isEpotekResource) {
    const { source } = contact;
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  const { roles = [] } = contact;

  if (collection === 'contacts') {
    return 'Contact e-Potek';
  }

  switch (roles[0]) {
    case 'user':
      return 'Client(e) e-Potek';
    case 'dev':
      return 'Dev e-Potek';
    case 'admin':
      return 'Admin e-Potek';
    case 'pro':
      return 'Pro e-Potek';

    default:
      return 'Contact';
  }
};

const ContactCard = props => {
  const { contact, isEpotekResource, refetch } = props;
  const {
    assignedEmployee,
    referredByUser,
    referredByOrganisation,
    createdAt,
    organisations = [],
    phoneNumbers = [],
    acquisitionChannel,
    tasks = [],
  } = contact;
  return (
    <FrontCard
      icon="person"
      title={getContactTitle(props)}
      subtitle={
        isEpotekResource && (
          <div className="flex sb center-align" style={{ flexGrow: 1 }}>
            <i className="secondary">
              Depuis{' '}
              {
                moment(createdAt)
                  .fromNow()
                  .split('il y a')[1]
              }
            </i>
            {assignedEmployee && (
              <img
                src={employeesById[assignedEmployee._id].src}
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
                alt={assignedEmployee.name}
              />
            )}
          </div>
        )
      }
      expanded
    >
      {!!phoneNumbers.length && (
        <FrontCardItem label="téléphones">
          <div className="flex center-align">
            {phoneNumbers.map(phone => (
              <a
                href={`tel:${phone.replace(' ', '')}`}
                className="link mr-8"
                key={phone}
              >
                {phone}
              </a>
            ))}
          </div>
        </FrontCardItem>
      )}
      {!!organisations.length && (
        <FrontCardItem
          label="organisation"
          onClick={() =>
            Front.openUrl(
              `${subdomains.admin}/organisations/${organisations[0]._id}`,
            )
          }
        >
          {organisations[0].name}
        </FrontCardItem>
      )}
      <FrontCardItem
        label="Conseiller"
        onClick={
          assignedEmployee &&
          (() =>
            Front.openUrl(`${subdomains.admin}/users/${assignedEmployee._id}`))
        }
      >
        {assignedEmployee?.name || '-'}
      </FrontCardItem>
      <FrontCardItem
        label="Référé par"
        onClick={
          referredByUser &&
          (() =>
            Front.openUrl(`${subdomains.admin}/users/${referredByUser._id}`))
        }
      >
        {referredByUser?.name || '-'}
      </FrontCardItem>

      <FrontCardItem
        label="Référé par organisation"
        onClick={
          referredByOrganisation &&
          (() =>
            Front.openUrl(
              `${subdomains.admin}/organisations/${referredByOrganisation._id}`,
            ))
        }
      >
        {referredByOrganisation?.name || '-'}
      </FrontCardItem>
      <FrontCardItem label="canal d'acquisition">
        {acquisitionChannel ? (
          <T id={`Forms.acquisitionChannel.${acquisitionChannel}`} />
        ) : (
          '-'
        )}
      </FrontCardItem>
      <FrontContactTasks tasks={tasks} refetch={refetch} />
    </FrontCard>
  );
};

export default ContactCard;
