//
import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import Widget1Part2 from 'core/components/widget1/Widget1Part2';
import { widget1Actions } from 'core/redux/widget1';
import PageApp from '../../components/PageApp';
import AppWidget1PageContainer from './AppWidget1PageContainer';

const AppWidget1Page = props => (
  <PageApp id="AppWidget1Page" fullWidth>
    <div className="app-widget1-page widget1-page">
      <Widget1Part2 {...props} />
    </div>
  </PageApp>
);

export default compose(
  connect(
    ({ widget1: { property } }) => ({ property }),
    dispatch => ({
      setStep: () => dispatch(widget1Actions.setStep(5)),
      reset: () => dispatch(widget1Actions.resetCalculator()),
    }),
  ),
  lifecycle({
    componentDidMount() {
      // Reset the whole calculator when the user boots the app
      // Don't reset it if property value is set (lazy, but should cover most cases)
      if (!this.props.property.value) {
        this.props.reset();
      }

      // Suggest values only works if step is greater or equal than 4
      // And steps don't exist in app, so just set it immediately to a higher value
      this.props.setStep();
    },
  }),
  AppWidget1PageContainer,
)(AppWidget1Page);
