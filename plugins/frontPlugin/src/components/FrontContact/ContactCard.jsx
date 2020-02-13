import React from 'react';
import moment from 'moment';

import FrontCard from '../FrontCard/FrontCard';
import FrontCardItem from '../FrontCard/FrontCardItem';
import T from '../../core/components/Translation';
import { employeesById } from '../../core/arrays/epotekEmployees';

const { Front, subdomains } = window;

const getContactTitle = props => {
  const { contact, collection, isEpotekResource } = props;
  if (!isEpotekResource) {
    const { source } = contact;
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  const { roles } = contact;

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
  const { contact, isEpotekResource } = props;
  const {
    email,
    name,
    assignedEmployee,
    referredByUser,
    referredByOrganisation,
    createdAt,
    organisations = [],
    phoneNumbers = [],
    acquisitionChannel,
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
      <FrontCardItem label="nom" data={name} />
      <FrontCardItem label="email" data={email} />
      {!!phoneNumbers.length && (
        <FrontCardItem label="téléphones" data={phoneNumbers.join(', ')} />
      )}
      {!!organisations.length && (
        <FrontCardItem
          label="organisation"
          data={organisations[0].name}
          dataOnClick={() =>
            Front.openUrl(
              `${subdomains.admin}/organisations/${organisations[0]._id}`,
            )
          }
        />
      )}
      {assignedEmployee && (
        <FrontCardItem
          label="Conseiller"
          data={assignedEmployee.name}
          dataOnClick={() =>
            Front.openUrl(`${subdomains.admin}/users/${assignedEmployee._id}`)
          }
        />
      )}
      {referredByUser && (
        <FrontCardItem
          label="Référé par"
          data={referredByUser.name}
          dataOnClick={() =>
            Front.openUrl(`${subdomains.admin}/users/${referredByUser._id}`)
          }
        />
      )}
      {referredByOrganisation && (
        <FrontCardItem
          label="Référé par organisation"
          data={referredByOrganisation.name}
          dataOnClick={() =>
            Front.openUrl(
              `${subdomains.admin}/organisations/${referredByOrganisation._id}`,
            )
          }
        />
      )}
      {acquisitionChannel && (
        <FrontCardItem
          label="canal d'acquisition"
          data={<T id={`Forms.acquisitionChannel.${acquisitionChannel}`} />}
        />
      )}
    </FrontCard>
  );
};

export default ContactCard;
