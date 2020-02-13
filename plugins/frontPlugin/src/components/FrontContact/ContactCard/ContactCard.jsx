import React from 'react';
import moment from 'moment';

import FrontCard from '../../FrontCard/FrontCard';
import FrontCardItem from '../../FrontCard/FrontCardItem';

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
  } = contact;
  return (
    <FrontCard
      icon="person"
      title={getContactTitle(props)}
      subtitle={
        isEpotekResource && (
          <i>
            Depuis{' '}
            {
              moment(createdAt)
                .fromNow()
                .split('il y a')[1]
            }
          </i>
        )
      }
      expanded
    >
      <FrontCardItem label="nom" data={name} />
      <FrontCardItem label="email" data={email} />
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
    </FrontCard>
  );
};

export default ContactCard;
