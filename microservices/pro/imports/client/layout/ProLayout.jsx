// @flow
import React from 'react';
import ProLayoutContainer from './ProLayoutContainer';

type ProLayoutProps = {};

const ProLayout = ({ children }: ProLayoutProps) => <div>{children}</div>;

export default ProLayoutContainer(ProLayout);
