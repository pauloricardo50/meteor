// @flow
import * as React from 'react';
import { Redirect } from 'react-router-dom';

import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import ProLayoutContainer from './ProLayoutContainer';
import ProTopNav from './ProTopNav';

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
      <LayoutErrorBoundary>
        <div className="pro-layout-content">
          {React.cloneElement(children, props)}
        </div>
      </LayoutErrorBoundary>
    </div>
  );
};

export default ProLayoutContainer(ProLayout);
