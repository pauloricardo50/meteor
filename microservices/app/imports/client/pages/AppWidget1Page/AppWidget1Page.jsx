// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import Widget1Part2 from 'core/components/widget1/Widget1Part2';
import { widget1Actions } from 'core/redux/widget1';
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

export default compose(
  connect(
    null,
    dispatch => ({ setStep: () => dispatch(widget1Actions.setStep(5)) }),
  ),
  lifecycle({
    componentDidMount() {
      // Suggest values only works if step is greater or equal than 4
      // And steps don't exist in app, so just set it immediately to a higher value
      this.props.setStep();
    },
  }),
  AppWidget1PageContainer,
)(AppWidget1Page);
