import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

import ProLayoutContainer from './ProLayoutContainer';
import ProSideNav from './ProSideNav';
import ProTopNav from './ProTopNav';

const ProLayout = ({ children, redirect, ...props }) => {
  const currentUser = useContext(CurrentUserContext);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="pro-layout">
      <ProTopNav currentUser={currentUser} />
      <ProSideNav currentUser={currentUser} />
      <div className="pro-layout-content" id="scroll-layout">
        <LayoutErrorBoundary>
          {React.cloneElement(children, { ...props, currentUser })}
        </LayoutErrorBoundary>
      </div>

      <ContactButton currentUser={currentUser} />
    </div>
  );
};

export default ProLayoutContainer(ProLayout);
