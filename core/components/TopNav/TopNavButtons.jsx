import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentUserContext } from '../../containers/CurrentUserContext';
import useMedia from '../../hooks/useMedia';
import Button from '../Button';
import T from '../Translation';
import TopNavDropdown from './TopNavDropdown';

const TopNavButtons = ({ children, history }) => {
  const currentUser = useContext(CurrentUserContext);
  const { name, organisations = [] } = currentUser || {};
  const isMobile = useMedia({ maxWidth: 768 });
  const mainOrganisation = organisations.find(
    ({ $metadata: { isMain } = {} }) => isMain,
  );

  return (
    <div className="buttons">
      {children}
      {currentUser ? (
        <>
          {!isMobile && (
            <div className="flex-col">
              <span>{name}</span>
              <span className="secondary">{mainOrganisation?.name}</span>
            </div>
          )}
          <TopNavDropdown currentUser={currentUser} />
        </>
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
