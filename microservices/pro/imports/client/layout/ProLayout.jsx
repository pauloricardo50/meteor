// @flow
import * as React from 'react';
import { Redirect } from 'react-router-dom';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import ProLayoutContainer from './ProLayoutContainer';
import ProTopNav from './ProTopNav';
import ProSideNav from './ProSideNav';

type ProLayoutProps = {
  children: React.Node,
};

const ProLayout = ({ children, redirect, ...props }: ProLayoutProps) => {
  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="pro-layout">
      <ProTopNav currentUser={props.currentUser} />
      <ProSideNav currentUser={props.currentUser} />
      <LayoutErrorBoundary>
        <div className="pro-layout-content" id="scroll-layout">
          {React.cloneElement(children, props)}
        </div>
      </LayoutErrorBoundary>

      <ContactButton currentUser={props.currentUser} />
    </div>
  );
};

export default ProLayoutContainer(ProLayout);
