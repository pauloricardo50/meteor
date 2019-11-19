import { Meteor } from 'meteor/meteor';
import React from 'react';

import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';

const makeGeneratePublicLink = propertyId => ref => {
  const propertyLink = `${Meteor.settings.public.subdomains.app}/?property-id=${propertyId}`;

  if (ref) {
    return `${propertyLink}&ref=${ref}`;
  }

  return propertyLink;
};

const makeTransformRef = (users, organisations) => id => {
  const user = users.find(({ _id }) => _id === id);
  const org = organisations.find(({ _id }) => _id === id);
  return user ? user.name : org.name;
};

const makeDescription = (property, transformRef) => ref => {
  if (ref) {
    return (
      <span>
        Voici le lien public généré pour le bien immobilier &quot;
        <b>{property.address1}</b>
        &quot;&nbsp;avec&quot;
        <b>{transformRef(ref)}</b>
        &quot;&nbsp;comme referral. Vous pouvez partager ce lien avec vos
        clients pour qu&apos;ils puissent y avoir accès de manière anonyme.
      </span>
    );
  }

  return (
    <span>
      Voici le lien public généré pour le bien immobilier &quot;
      <b>{property.address1}</b>
      &quot;.&nbsp;Vous pouvez partager ce lien avec vos clients pour
      qu&apos;ils puissent y avoir accès de manière anonyme.
    </span>
  );
};

export default withProps(({ property }) => {
  const { users = [] } = property;
  const organisations = uniqBy(
    users.reduce(
      (orgs, { organisations: userOrgs = [] }) => [...orgs, ...userOrgs],
      [],
    ),
    '_id',
  );

  const transformRef = makeTransformRef(users, organisations);

  return {
    schema: new SimpleSchema({
      ref: {
        type: String,
        optional: true,
        allowedValues: [
          ...users.map(({ _id }) => _id),
          ...organisations.map(({ _id }) => _id),
        ],
        defaultValue: Meteor.microservice === 'pro' ? Meteor.userId() : null,
        uniforms: {
          transform: transformRef,
          displayEmpty: true,
          placeholder: 'Aucun',
        },
      },
    }),
    generatePublicLink: makeGeneratePublicLink(property._id),
    makeDescription: makeDescription(property, transformRef),
  };
});
