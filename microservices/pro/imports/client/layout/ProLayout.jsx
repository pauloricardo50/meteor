// @flow
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import ProLayoutContainer from './ProLayoutContainer';
import ProTopNav from './ProTopNav';
import ProSideNav from './ProSideNav';

type ProLayoutProps = {};

const ProLayout = ({ children, redirect, ...props }: ProLayoutProps) => {
  console.log('redirect:', redirect);
  const currentUser = useContext(CurrentUserContext);
  console.log('ProLayout currentUser:', currentUser);
  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="pro-layout">
      <ProTopNav currentUser={currentUser} />
      <ProSideNav currentUser={currentUser} />
      <LayoutErrorBoundary>
        <div className="pro-layout-content" id="scroll-layout">
          {React.cloneElement(children, props)}
        </div>
      </LayoutErrorBoundary>

      <ContactButton currentUser={currentUser} />
    </div>
  );
};

export default ProLayoutContainer(ProLayout);
