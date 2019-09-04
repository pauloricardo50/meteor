// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';

import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import T from '../Translation';
import TopNavDropdown from './TopNavDropdown';

type TopNavButtonsProps = {};

const TopNavButtons = ({
  children,
  currentUser,
  history,
}: TopNavButtonsProps) => {
  const { name, organisations } = currentUser || {};
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <div className="buttons">
      {children}
      {currentUser ? (
        <React.Fragment>
          {!isMobile && (
            <div className="flex-col">
              <span>{name}</span>
              <span className="secondary">
                {organisations
                  && organisations.length > 0
                  && organisations[0].name}
              </span>
            </div>
          )}
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
