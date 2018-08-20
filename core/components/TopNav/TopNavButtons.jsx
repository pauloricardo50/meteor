// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import TopNavDropdown from './TopNavDropdown';
import { ImpersonateWarningWithTracker } from '../Impersonate/ImpersonateWarning';
import Button from '../Button';
import T from '../Translation';

type TopNavButtonsProps = {};

const TopNavButtons = (props: TopNavButtonsProps) => {
  const { children, currentUser } = props;
  return (
    <div className="buttons">
      <ImpersonateWarningWithTracker />
      {children}
      {currentUser ? (
        <React.Fragment>
          {currentUser.email}
          <TopNavDropdown {...props} />
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
