import { Meteor } from 'meteor/meteor';
import { Mutation } from 'meteor/cultofcoders:mutations';
import { Match, check } from 'meteor/check';
import { getCookie } from 'core/utils/cookiesHelpers';
import { TRACKING_COOKIE } from '../analytics/analyticsConstants';
import { internalMethod } from './server/methodHelpers';

if (Meteor.isTest || Meteor.isAppTest) {
  Mutation.isDebugEnabled = false;
} else {
  Mutation.isDebugEnabled = { omit: ['analyticsPage', 'analyticsLogin'] };
}

export class Method extends Mutation {
  appendClientParams({ config, callParams, options }) {
    let location;
    if (Meteor.isClient && window && window.location) {
      location = {
        href: window.location.href,
        host: window.location.host,
        pathname: window.location.pathname,
      };
    }

    let trackingId;
    if (Meteor.isClient && document && document.cookie) {
      trackingId = getCookie(TRACKING_COOKIE);
    }

    const additionalData = { location, trackingId };
    const { name } = config;

    return new Promise((resolve, reject) => {
      Meteor.apply(
        name,
        [callParams, additionalData],
        options,
        (error, result) => {
          const aopData = {
            config,
            params: callParams,
            result,
            error,
          };

          Mutation.callAOP.executeAfters(aopData);
          this.callAOP.executeAfters(aopData);

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  setClientParams(additionalData) {
    if (Meteor.isServer && additionalData.location) {
      const { setClientUrl } = require('../../utils/server/getClientUrl');
      setClientUrl(additionalData.location);
    }

    if (Meteor.isServer && additionalData.trackingId) {
      const {
        setClientTrackingId,
      } = require('../../utils/server/getClientTrackingId');
      setClientTrackingId(additionalData.trackingId);
    }
  }

  run(callParams = {}, options = {}) {
    const { config } = this;

    const aopData = { config, params: callParams };
    Mutation.callAOP.executeBefores(aopData);
    this.callAOP.executeBefores(aopData);

    return this.appendClientParams({ config, callParams, aopData, options });
  }

  serverRun(...args) {
    return internalMethod(() => this.run(...args));
  }

  setHandler(fn) {
    const { config } = this;
    const { name, params } = config;
    const self = this;

    Meteor.methods({
      [name](params = {}, additionalData) {
        check(additionalData, Object);
        check(
          additionalData.location,
          Match.Maybe({
            href: Match.Maybe(String),
            host: Match.Maybe(String),
            pathname: Match.Maybe(String),
          }),
        );

        self.setClientParams(additionalData);

        if (config.validate) {
          config.validate(params);
        } else if (config.params) {
          check(params, config.params);
        }

        let aopData = {
          context: this,
          config,
          params,
        };

        Mutation.executionAOP.executeBefores(aopData);
        self.executionAOP.executeBefores(aopData);

        let error;
        let result;
        try {
          result = fn.call(null, this, params);
        } catch (e) {
          error = e;
        }

        aopData = {
          context: this,
          config,
          params,
          result,
          error,
        };

        Mutation.executionAOP.executeAfters(aopData);
        self.executionAOP.executeAfters(aopData);

        if (error) {
          throw error;
        }

        return result;
      },
    });
  }
}
