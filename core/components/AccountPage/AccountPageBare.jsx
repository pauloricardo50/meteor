// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from '../Translation';
import EmailModifier from '../EmailModifier';
import PasswordChange from './PasswordChange';
import DeveloperSection from './DeveloperSection';
import AccountPageHeader from './AccountPageHeader';
import AccountModifier from './AccountModifier';
import TooltipArray from '../TooltipArray';

type AccountPageBareProps = {};

const AccountPageBare = ({ currentUser }: AccountPageBareProps) => {
  const { email, _id: userId, phoneNumbers = [] } = currentUser;

  return (
    <div className="card1 card-top account-page">
      <AccountPageHeader currentUser={currentUser} />

      <div className="account-page-info">
        <div>
          <h4>
            <T id="AccountPage.email" />
          </h4>
          <span className="secondary">
            {email} <EmailModifier userId={userId} email={email} />
          </span>
        </div>
        {phoneNumbers && phoneNumbers.length > 0 && (
          <div>
            <h4>
              <T id="AccountPage.phone" />
            </h4>
            <TooltipArray
              title="Numéros de téléphone"
              items={phoneNumbers.map(number => (
                <a key={number} href={`tel:${number}`}>
                  <span>
                    {number}
                    &nbsp;
                  </span>
                </a>
              ))}
            />
          </div>
        )}
      </div>

      <span className="flex-col space-children">
        <AccountModifier currentUser={currentUser} />

        <PasswordChange />
      </span>

      {Meteor.microservice === 'pro' && <DeveloperSection user={currentUser} />}
    </div>
  );
};

export default AccountPageBare;
