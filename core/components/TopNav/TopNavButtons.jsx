import React from 'react';
import { withRouter } from 'react-router-dom';

import { CTA_ID } from '../../api/analytics/analyticsConstants';
import useCurrentUser from '../../hooks/useCurrentUser';
import useMedia from '../../hooks/useMedia';
import { getMainOrganisation } from '../../utils/userFunctions';
import Button from '../Button';
import T from '../Translation';
import TopNavDropdown from './TopNavDropdown';

const TopNavButtons = ({ children, history }) => {
  const currentUser = useCurrentUser();
  const { name } = currentUser || {};
  const isMobile = useMedia({ maxWidth: 768 });
  const mainOrganisation = getMainOrganisation(currentUser);

  return (
    <div className="buttons">
      {children}
      {currentUser ? (
        <>
          {!isMobile && (
            <div className="flex-col mr-8">
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
          ctaId={CTA_ID.LOGIN_NAVBAR}
        />
      )}
    </div>
  );
};

export default withRouter(TopNavButtons);
