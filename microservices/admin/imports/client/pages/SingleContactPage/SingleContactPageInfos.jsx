import React from 'react';
import { CollectionIconLink } from 'core/components/IconLink';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import Icon from 'core/components/Icon';

const getAddress = ({ address, organisations }) => {
  const { address: organisationAddress } =
    organisations.find(({ $metadata }) => $metadata.useSameAddress) || {};
  return organisationAddress || address;
};

const SingleContactPageInfos = ({ contact }) => {
  const { organisations = [], email, phoneNumbers } = contact;
  return (
    <div className="single-contact-page-infos">
      <div className="organisations">
        {organisations.length > 0
          ? organisations.map(organisation => (
              <CollectionIconLink
                key={organisation._id}
                relatedDoc={{
                  ...organisation,
                  collection: ORGANISATIONS_COLLECTION,
                }}
              />
            ))
          : "N'est lié à aucune organisation"}
      </div>
      <div className="contact-details space-children">
        <span>{getAddress(contact)}</span>
        <div className="flex flex-row space-children">
          <div className="flex flex-row space-children">
            <Icon type="mail" /> <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div className="flex flex-row space-children">
            <Icon type="phone" />
            {phoneNumbers.map(number => (
              <a key={number} href={`tel:${number}`}>
                {number}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleContactPageInfos;
