// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withRouter } from 'react-router-dom';

import TopNavDropdown from './TopNavDropdown';
import Button from '../Button';
import T from '../Translation';

type TopNavButtonsProps = {};

const TopNavButtons = ({
  children,
  currentUser,
  history,
}: TopNavButtonsProps) => {
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
          onClick={() => history.push('/login')}
        />
      )}
    </div>
  );
};

export default withRouter(TopNavButtons);
