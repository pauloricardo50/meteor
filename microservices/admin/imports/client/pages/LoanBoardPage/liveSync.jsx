import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { liveSyncs } from 'core/api/liveSync/liveSync';
import { ACTIONS } from './loanBoardConstants';

export const addLiveSync = Comp =>
  class extends Component {
    componentDidMount() {
      // Reset all livesyncs
      Meteor.call('liveSyncStop');
      Meteor.call('liveSyncClear');
    }

    componentWillReceiveProps({
      options: nextOptions,
      activateLoanBoardSync: nextActivateSync,
    }) {
      const { activateLoanBoardSync } = this.props;
      if (nextActivateSync === true) {
        Meteor.call('liveSyncUpdate', JSON.stringify(nextOptions));
      }

      if (activateLoanBoardSync && !nextActivateSync) {
        Meteor.call('liveSyncStop');
      } else if (!activateLoanBoardSync && nextActivateSync === true) {
        Meteor.call('liveSyncStart');
        Meteor.call('liveSyncUpdate', JSON.stringify(nextOptions));
      }
    }

    componentWillUnmount() {
      Meteor.call('liveSyncStop');
    }

    render() {
      return <Comp {...this.props} />;
    }
  };

export const withLiveSync = compose(
  withSmartQuery({
    query: liveSyncs,
    params: ({ activateLoanBoardSync }) => ({ userId: activateLoanBoardSync }),
    queryOptions: { reactive: true, single: true },
    dataName: 'liveSyncOptions',
    renderMissingDoc: false,
  }),
  Comp =>
    class extends Component {
      componentDidMount() {
        const { dispatch, liveSyncOptions } = this.props;
        if (liveSyncOptions) {
          dispatch({
            type: ACTIONS.RESET,
            payload: JSON.parse(liveSyncOptions.options),
          });
        }
      }

      componentWillReceiveProps({ liveSyncOptions: nextOptions }) {
        const { activateLoanBoardSync, liveSyncOptions: options, dispatch } = this.props;
        if (
          activateLoanBoardSync
          && activateLoanBoardSync !== true
          && nextOptions
          && (options && options.options) !== (nextOptions && nextOptions.options)
        ) {
          dispatch({
            type: ACTIONS.RESET,
            payload: JSON.parse(nextOptions.options),
          });
        }
      }

      render() {
        return <Comp {...this.props} />;
      }
    },
);

export const LiveQueryMonitor = withSmartQuery({
  query: liveSyncs,
  queryOptions: { reactive: true },
  dataName: 'currentLiveSyncs',
})(({ currentLiveSyncs, devAndAdmins, activateLoanBoardSync, setActivateLoanBoardSync }) => {
  const currentUserId = Meteor.userId();
  return (
    <div>
      <h4
        style={{ margin: 0, color: activateLoanBoardSync === true ? 'blue' : '' }}
        onClick={() => setActivateLoanBoardSync(!activateLoanBoardSync)}
      >
        Synchroniser
      </h4>
      {currentLiveSyncs
        .filter(({ userId }) => userId !== currentUserId)
        .map(({ userId }) => {
          const admin = devAndAdmins.find(({ _id }) => _id === userId);
          const isSynced = userId === activateLoanBoardSync;
          return (
            <div
              key={userId}
              onClick={() => setActivateLoanBoardSync(isSynced ? false : userId)}
              style={{ color: isSynced ? 'red' : '', marginTop: 8 }}
            >
              {admin.firstName}
            </div>
          );
        })}
    </div>
  );
});
