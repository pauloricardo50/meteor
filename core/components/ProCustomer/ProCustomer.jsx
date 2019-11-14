// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { USERS_COLLECTION } from '../../api/users/userConstants';
import { CollectionIconLink } from '../IconLink';

type ProCustomerProps = {};

const ProCustomer = ({ user, invitedByUser }: ProCustomerProps) => {
  const { _id, name, phoneNumbers = ['-'], email, assignedEmployee } = user;
  const isPro = Meteor.microservice === 'pro';

  return (
    <CollectionIconLink
      relatedDoc={{ name, _id, collection: USERS_COLLECTION }}
      noRoute={isPro}
      replacementPopup={
        isPro && (
          <div>
            <h4 style={{ marginTop: 0 }}>{name}</h4>

            <div>
              <b>Email:</b> {email}
            </div>

            <div>
              <b>Tél:</b> {phoneNumbers[0]}
            </div>

            <div>
              <b>Invité par:</b> {invitedByUser}
            </div>

            {assignedEmployee && (
              <div className="flex center-align">
                <b>Conseiller:</b>&nbsp;
                <CollectionIconLink
                  relatedDoc={{
                    ...assignedEmployee,
                    collection: USERS_COLLECTION,
                  }}
                  noRoute
                  replacementPopup={
                    isPro && (
                      <div>
                        <h4 style={{ marginTop: 0 }}>
                          {assignedEmployee.name}
                        </h4>

                        <div>
                          <b>Email:</b> {assignedEmployee.email}
                        </div>

                        <div>
                          <b>Tél:</b>{' '}
                          {assignedEmployee.phoneNumbers &&
                          assignedEmployee.phoneNumbers.length
                            ? assignedEmployee.phoneNumbers[0]
                            : '-'}
                        </div>
                      </div>
                    )
                  }
                />
              </div>
            )}
          </div>
        )
      }
    />
  );
};

export default ProCustomer;
