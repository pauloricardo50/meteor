// @flow
import * as React from 'react';
import { Redirect } from 'react-router-dom';

import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import ProLayoutContainer from './ProLayoutContainer';
import Navs from './Navs';

const getRedirect = () => {};

type ProLayoutProps = {
  children: React.Node,
};

const ProLayout = ({ children, ...props }: ProLayoutProps) => {
  const redirect = getRedirect();

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="pro-layout">
      <Navs />
      <LayoutErrorBoundary>
        <div className="pro-layout-content">
          {React.cloneElement(children, props)}
        </div>
      </LayoutErrorBoundary>
    </div>
  );
};

export default ProLayoutContainer(ProLayout);
