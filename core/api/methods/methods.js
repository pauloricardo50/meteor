import { Meteor } from 'meteor/meteor';
import { Mutation } from 'meteor/cultofcoders:mutations';
import { Match, check } from 'meteor/check';

// import { setMethodLimiter } from '../../utils/rate-limit';

if (Meteor.isTest) {
  Mutation.isDebugEnabled = false;
} else {
  Mutation.isDebugEnabled = { omit: ['analyticsPage', 'analyticsLogin'] };
}

export class Method extends Mutation {
  run(callParams = {}, options = {}) {
    const { config } = this;
    let location;
    if (Meteor.isClient && window && window.location) {
      location = {
        href: window.location.href,
        host: window.location.host,
        pathname: window.location.pathname,
      };
    }

    const aopData = { config, params: callParams };
    Mutation.callAOP.executeBefores(aopData);
    this.callAOP.executeBefores(aopData);

    const { name, params } = config;
    const additionalData = { location };

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

  setHandler(fn) {
    const { config } = this;
    const { name, params } = config;
    const self = this;

    Meteor.methods({
      [name](params = {}, additionalData) {
        check(
          additionalData,
          Match.Maybe({
            location: Match.Maybe({
              href: Match.Maybe(String),
              host: Match.Maybe(String),
              pathname: Match.Maybe(String),
            }),
          }),
        );

        if (Meteor.isServer && additionalData.location) {
          const { setClientUrl } = require('../../utils/server/getClientUrl');
          setClientUrl(additionalData.location);
        }

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
