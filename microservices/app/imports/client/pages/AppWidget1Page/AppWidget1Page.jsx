// @flow
import React from 'react';

import Widget1Part2 from 'core/components/widget1/Widget1Part2';
import Page from '../../components/Page';
import AppWidget1PageContainer from './AppWidget1PageContainer';

type AppWidget1PageProps = {};

const AppWidget1Page = (props: AppWidget1PageProps) => (
  <Page id="AppWidget1Page" fullWidth>
    <div className="app-widget1-page widget1-page">
      <Widget1Part2 {...props} />
    </div>
  </Page>
);

export default AppWidget1PageContainer(AppWidget1Page);
