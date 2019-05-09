// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import TopNavDropdown from './TopNavDropdown';
import Button from '../Button';
import T from '../Translation';

type TopNavButtonsProps = {};

const TopNavButtons = (props: TopNavButtonsProps) => {
  const { children, currentUser } = props;
  const { name, organisations } = currentUser || {};

  return (
    <div className="buttons">
      {children}
      {currentUser ? (
        <React.Fragment>
          <div className="flex-col">
            <span>{name}</span>
            <span className="secondary">
              {organisations
                && organisations.length > 0
                && organisations[0].name}
            </span>
          </div>
          <TopNavDropdown currentUser={currentUser} />
        </React.Fragment>
      ) : (
        <Button
          label={<T id="TopNav.login" />}
          primary
          onClick={() =>
            window.location.replace(`${Meteor.settings.public.subdomains.app}/login`)
          }
        />
      )}
    </div>
  );
};

export default TopNavButtons;
