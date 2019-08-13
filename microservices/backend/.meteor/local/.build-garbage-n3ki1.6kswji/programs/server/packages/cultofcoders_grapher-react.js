(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher-react":{"main.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/main.server.js                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
module.link("./setDefaults.js", {
  default: "setDefaults"
}, 1);
module.link("./withQuery.js", {
  default: "withQuery"
}, 2);
module.link("./legacy/createQueryContainer.js", {
  default: "createQueryContainer"
}, 3);
checkNpmVersions({
  react: '15.3 - 16',
  'prop-types': '15.0 - 16'
}, 'cultofcoders:grapher-react');
////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/defaults.js                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
module.exportDefault({
  reactive: false,
  single: false,
  dataProp: 'data'
});
////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDefaults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/setDefaults.js                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
module.export({
  default: () => setDefaults
});
let defaults;
module.link("./defaults", {
  default(v) {
    defaults = v;
  }

}, 0);

function setDefaults(newDefaults) {
  Object.assign(defaults, newDefaults);
}
////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/withQuery.js                                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let defaults;
module.link("./defaults", {
  default(v) {
    defaults = v;
  }

}, 1);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 2);
let withReactiveQuery;
module.link("./lib/withReactiveQuery", {
  default(v) {
    withReactiveQuery = v;
  }

}, 3);
let withQueryContainer;
module.link("./lib/withQueryContainer", {
  default(v) {
    withQueryContainer = v;
  }

}, 4);
let withStaticQuery;
module.link("./lib/withStaticQuery", {
  default(v) {
    withStaticQuery = v;
  }

}, 5);
let checkOptions;
module.link("./lib/checkOptions", {
  default(v) {
    checkOptions = v;
  }

}, 6);
module.exportDefault(function (handler, _config = {}) {
  checkOptions(_config);
  const config = Object.assign({}, defaults, _config);
  return function (component) {
    const queryContainer = withQueryContainer(component);

    if (!config.reactive) {
      const staticQueryContainer = withStaticQuery(config)(queryContainer);
      return function (props) {
        const query = handler(props);
        return React.createElement(staticQueryContainer, {
          query,
          props,
          config
        });
      };
    } else {
      return withReactiveQuery(handler, config, queryContainer);
    }
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////

},"legacy":{"createQueryContainer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/legacy/createQueryContainer.js                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let createContainer;
module.link("meteor/react-meteor-data", {
  createContainer(v) {
    createContainer = v;
  }

}, 1);
module.exportDefault((query, component, options = {}) => {
  if (Meteor.isDevelopment) {
    console.warn('createQueryContainer() is deprecated, please use withQuery() instead');
  }

  if (options.reactive) {
    return createContainer(props => {
      if (props.params) {
        query.setParams(props.params);
      }

      const handler = query.subscribe();
      return (0, _objectSpread2.default)({
        query,
        loading: !handler.ready(),
        [options.dataProp]: options.single ? _.first(query.fetch()) : query.fetch()
      }, props);
    }, component);
  }

  class MethodQueryComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        [options.dataProp]: undefined,
        error: undefined,
        loading: true
      };
    }

    componentWillReceiveProps(nextProps) {
      this._fetch(nextProps.params);
    }

    componentDidMount() {
      this._fetch(this.props.params);
    }

    _fetch(params) {
      if (params) {
        query.setParams(params);
      }

      query.fetch((error, data) => {
        const state = {
          error,
          [options.dataProp]: options.single ? _.first(data) : data,
          loading: false
        };
        this.setState(state);
      });
    }

    render() {
      const {
        state,
        props
      } = this;
      return React.createElement(component, (0, _objectSpread2.default)({
        query
      }, state, props));
    }

  }

  MethodQueryComponent.propTypes = {
    params: React.PropTypes.object
  };
  return MethodQueryComponent;
});
////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"checkOptions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/lib/checkOptions.js                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 1);
module.exportDefault(function (options) {
  check(options, {
    reactive: Match.Maybe(Boolean),
    single: Match.Maybe(Boolean),
    pollingMs: Match.Maybe(Number),
    errorComponent: Match.Maybe(Match.Any),
    loadingComponent: Match.Maybe(Match.Any),
    dataProp: Match.Maybe(String),
    loadOnRefetch: Match.Maybe(Boolean),
    shouldRefetch: Match.Maybe(Function)
  });

  if (options.reactive && options.poll) {
    throw new Meteor.Error(`You cannot have a query that is reactive and it is with polling`);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDisplayName.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/lib/getDisplayName.js                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
module.export({
  default: () => getDisplayName
});

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQueryContainer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/lib/withQueryContainer.js                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => withQueryContainer
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Query, NamedQuery;
module.link("meteor/cultofcoders:grapher-react", {
  Query(v) {
    Query = v;
  },

  NamedQuery(v) {
    NamedQuery = v;
  }

}, 2);
let getDisplayName;
module.link("./getDisplayName", {
  default(v) {
    getDisplayName = v;
  }

}, 3);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 4);
const propTypes = {
  grapher: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    data: PropTypes.array,
    query: PropTypes.oneOfType([PropTypes.instanceOf(Query), PropTypes.instanceOf(NamedQuery)])
  }).isRequired,
  config: PropTypes.object.isRequired,
  props: PropTypes.object
};

function withQueryContainer(WrappedComponent) {
  let GrapherQueryContainer = function ({
    grapher,
    config,
    query,
    props
  }) {
    const {
      isLoading,
      error,
      data
    } = grapher;

    if (error && config.errorComponent) {
      return React.createElement(config.errorComponent, {
        error,
        query
      });
    }

    if (isLoading && config.loadingComponent) {
      return React.createElement(config.loadingComponent, {
        query
      });
    }

    return React.createElement(WrappedComponent, (0, _objectSpread2.default)({}, props, {
      isLoading: error ? false : isLoading,
      error,
      [config.dataProp]: config.single ? data[0] : data,
      query
    }));
  };

  GrapherQueryContainer.propTypes = propTypes;
  GrapherQueryContainer.displayName = `GrapherQuery(${getDisplayName(WrappedComponent)})`;
  return GrapherQueryContainer;
}
////////////////////////////////////////////////////////////////////////////////////////////////////

},"withReactiveQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/lib/withReactiveQuery.js                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => withReactiveContainer
});
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 0);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 1);

function withReactiveContainer(handler, config, QueryComponent) {
  let subscriptionError = new ReactiveVar();
  return withTracker(props => {
    const query = handler(props);
    const subscriptionHandle = query.subscribe({
      onStop(err) {
        if (err) {
          subscriptionError.set(err);
        }
      },

      onReady() {
        subscriptionError.set(null);
      }

    });
    const isReady = subscriptionHandle.ready();
    const data = query.fetch();
    return {
      grapher: {
        isLoading: !isReady,
        data,
        error: subscriptionError
      },
      query,
      config,
      props
    };
  })(errorTracker(QueryComponent));
}

const errorTracker = withTracker(props => {
  const error = props.grapher.error.get();
  return (0, _objectSpread2.default)({}, props, {
    grapher: (0, _objectSpread2.default)({}, props.grapher, {
      error
    })
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////

},"withStaticQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/cultofcoders_grapher-react/lib/withStaticQuery.js                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => withStaticQueryContainer
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let getDisplayName;
module.link("./getDisplayName", {
  default(v) {
    getDisplayName = v;
  }

}, 1);

function withStaticQueryContainer(config) {
  return function (WrappedComponent) {
    /**
     * We use it like this so we can have naming inside React Dev Tools
     * This is a standard pattern in HOCs
     */
    class GrapherStaticQueryContainer extends React.Component {
      constructor(...args) {
        super(...args);
        this.state = {
          isLoading: true,
          error: null,
          data: []
        };

        this.refetch = () => {
          const {
            loadOnRefetch = true
          } = config;
          const {
            query
          } = this.props;

          if (loadOnRefetch) {
            this.setState({
              isLoading: true
            }, () => {
              this.fetch(query);
            });
          } else {
            this.fetch(query);
          }
        };
      }

      componentWillReceiveProps(nextProps) {
        const {
          query
        } = nextProps;

        if (!config.shouldRefetch) {
          this.fetch(query);
        } else if (config.shouldRefetch(this.props, nextProps)) {
          this.fetch(query);
        }
      }

      componentDidMount() {
        const {
          query,
          config
        } = this.props;
        this.fetch(query);

        if (config.pollingMs) {
          this.pollingInterval = setInterval(() => {
            this.fetch(query);
          }, config.pollingMs);
        }
      }

      componentWillUnmount() {
        this.pollingInterval && clearInterval(this.pollingInterval);
      }

      fetch(query) {
        query.fetch((error, data) => {
          if (error) {
            this.setState({
              error,
              data: [],
              isLoading: false
            });
          } else {
            this.setState({
              error: null,
              data,
              isLoading: false
            });
          }
        });
      }

      render() {
        const {
          config,
          props,
          query
        } = this.props;
        return React.createElement(WrappedComponent, {
          grapher: this.state,
          config,
          query,
          props: (0, _objectSpread2.default)({}, props, {
            refetch: this.refetch
          })
        });
      }

    }

    GrapherStaticQueryContainer.displayName = `StaticQuery(${getDisplayName(WrappedComponent)})`;
    return GrapherStaticQueryContainer;
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher-react/main.server.js");

/* Exports */
Package._define("cultofcoders:grapher-react", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher-react.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2RlZmF1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9zZXREZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3Qvd2l0aFF1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9sZWdhY3kvY3JlYXRlUXVlcnlDb250YWluZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2xpYi9jaGVja09wdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2xpYi9nZXREaXNwbGF5TmFtZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbGliL3dpdGhRdWVyeUNvbnRhaW5lci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbGliL3dpdGhSZWFjdGl2ZVF1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9saWIvd2l0aFN0YXRpY1F1ZXJ5LmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImRlZmF1bHQiLCJyZWFjdCIsImV4cG9ydERlZmF1bHQiLCJyZWFjdGl2ZSIsInNpbmdsZSIsImRhdGFQcm9wIiwiZXhwb3J0Iiwic2V0RGVmYXVsdHMiLCJkZWZhdWx0cyIsIm5ld0RlZmF1bHRzIiwiT2JqZWN0IiwiYXNzaWduIiwiUmVhY3QiLCJ3aXRoVHJhY2tlciIsIndpdGhSZWFjdGl2ZVF1ZXJ5Iiwid2l0aFF1ZXJ5Q29udGFpbmVyIiwid2l0aFN0YXRpY1F1ZXJ5IiwiY2hlY2tPcHRpb25zIiwiaGFuZGxlciIsIl9jb25maWciLCJjb25maWciLCJjb21wb25lbnQiLCJxdWVyeUNvbnRhaW5lciIsInN0YXRpY1F1ZXJ5Q29udGFpbmVyIiwicHJvcHMiLCJxdWVyeSIsImNyZWF0ZUVsZW1lbnQiLCJjcmVhdGVDb250YWluZXIiLCJvcHRpb25zIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyYW1zIiwic2V0UGFyYW1zIiwic3Vic2NyaWJlIiwibG9hZGluZyIsInJlYWR5IiwiXyIsImZpcnN0IiwiZmV0Y2giLCJNZXRob2RRdWVyeUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwic3RhdGUiLCJ1bmRlZmluZWQiLCJlcnJvciIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJfZmV0Y2giLCJjb21wb25lbnREaWRNb3VudCIsImRhdGEiLCJzZXRTdGF0ZSIsInJlbmRlciIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImNoZWNrIiwiTWF0Y2giLCJNYXliZSIsIkJvb2xlYW4iLCJwb2xsaW5nTXMiLCJOdW1iZXIiLCJlcnJvckNvbXBvbmVudCIsIkFueSIsImxvYWRpbmdDb21wb25lbnQiLCJTdHJpbmciLCJsb2FkT25SZWZldGNoIiwic2hvdWxkUmVmZXRjaCIsIkZ1bmN0aW9uIiwicG9sbCIsIkVycm9yIiwiZ2V0RGlzcGxheU5hbWUiLCJXcmFwcGVkQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJuYW1lIiwiUXVlcnkiLCJOYW1lZFF1ZXJ5IiwiZ3JhcGhlciIsInNoYXBlIiwiaXNMb2FkaW5nIiwiYm9vbCIsImlzUmVxdWlyZWQiLCJhcnJheSIsIm9uZU9mVHlwZSIsImluc3RhbmNlT2YiLCJHcmFwaGVyUXVlcnlDb250YWluZXIiLCJ3aXRoUmVhY3RpdmVDb250YWluZXIiLCJSZWFjdGl2ZVZhciIsIlF1ZXJ5Q29tcG9uZW50Iiwic3Vic2NyaXB0aW9uRXJyb3IiLCJzdWJzY3JpcHRpb25IYW5kbGUiLCJvblN0b3AiLCJlcnIiLCJzZXQiLCJvblJlYWR5IiwiaXNSZWFkeSIsImVycm9yVHJhY2tlciIsImdldCIsIndpdGhTdGF0aWNRdWVyeUNvbnRhaW5lciIsIkdyYXBoZXJTdGF0aWNRdWVyeUNvbnRhaW5lciIsInJlZmV0Y2giLCJwb2xsaW5nSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiY2xlYXJJbnRlcnZhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFBOEZGLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNFLFNBQU8sRUFBQztBQUFULENBQS9CLEVBQXVELENBQXZEO0FBQTBESCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDRSxTQUFPLEVBQUM7QUFBVCxDQUE3QixFQUFtRCxDQUFuRDtBQUFzREgsTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ0UsU0FBTyxFQUFDO0FBQVQsQ0FBL0MsRUFBZ0YsQ0FBaEY7QUFFbk9KLGdCQUFnQixDQUFDO0FBQ2JLLE9BQUssRUFBRSxXQURNO0FBRWIsZ0JBQWM7QUFGRCxDQUFELEVBR2IsNEJBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNGQUosTUFBTSxDQUFDSyxhQUFQLENBQWU7QUFDWEMsVUFBUSxFQUFFLEtBREM7QUFFWEMsUUFBTSxFQUFFLEtBRkc7QUFHWEMsVUFBUSxFQUFFO0FBSEMsQ0FBZixFOzs7Ozs7Ozs7OztBQ0FBUixNQUFNLENBQUNTLE1BQVAsQ0FBYztBQUFDTixTQUFPLEVBQUMsTUFBSU87QUFBYixDQUFkO0FBQXlDLElBQUlDLFFBQUo7QUFBYVgsTUFBTSxDQUFDQyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDUyxZQUFRLEdBQUNULENBQVQ7QUFBVzs7QUFBdkIsQ0FBekIsRUFBa0QsQ0FBbEQ7O0FBRXZDLFNBQVNRLFdBQVQsQ0FBcUJFLFdBQXJCLEVBQWtDO0FBQzdDQyxRQUFNLENBQUNDLE1BQVAsQ0FBY0gsUUFBZCxFQUF3QkMsV0FBeEI7QUFDSCxDOzs7Ozs7Ozs7OztBQ0pELElBQUlHLEtBQUo7QUFBVWYsTUFBTSxDQUFDQyxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDYSxTQUFLLEdBQUNiLENBQU47QUFBUTs7QUFBcEIsQ0FBcEIsRUFBMEMsQ0FBMUM7QUFBNkMsSUFBSVMsUUFBSjtBQUFhWCxNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNFLFNBQU8sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNTLFlBQVEsR0FBQ1QsQ0FBVDtBQUFXOztBQUF2QixDQUF6QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJYyxXQUFKO0FBQWdCaEIsTUFBTSxDQUFDQyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ2UsYUFBVyxDQUFDZCxDQUFELEVBQUc7QUFBQ2MsZUFBVyxHQUFDZCxDQUFaO0FBQWM7O0FBQTlCLENBQXZDLEVBQXVFLENBQXZFO0FBQTBFLElBQUllLGlCQUFKO0FBQXNCakIsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVosRUFBc0M7QUFBQ0UsU0FBTyxDQUFDRCxDQUFELEVBQUc7QUFBQ2UscUJBQWlCLEdBQUNmLENBQWxCO0FBQW9COztBQUFoQyxDQUF0QyxFQUF3RSxDQUF4RTtBQUEyRSxJQUFJZ0Isa0JBQUo7QUFBdUJsQixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDZ0Isc0JBQWtCLEdBQUNoQixDQUFuQjtBQUFxQjs7QUFBakMsQ0FBdkMsRUFBMEUsQ0FBMUU7QUFBNkUsSUFBSWlCLGVBQUo7QUFBb0JuQixNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDaUIsbUJBQWUsR0FBQ2pCLENBQWhCO0FBQWtCOztBQUE5QixDQUFwQyxFQUFvRSxDQUFwRTtBQUF1RSxJQUFJa0IsWUFBSjtBQUFpQnBCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNFLFNBQU8sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNrQixnQkFBWSxHQUFDbEIsQ0FBYjtBQUFlOztBQUEzQixDQUFqQyxFQUE4RCxDQUE5RDtBQUFwZ0JGLE1BQU0sQ0FBQ0ssYUFBUCxDQVFlLFVBQVNnQixPQUFULEVBQWtCQyxPQUFPLEdBQUcsRUFBNUIsRUFBZ0M7QUFDM0NGLGNBQVksQ0FBQ0UsT0FBRCxDQUFaO0FBQ0EsUUFBTUMsTUFBTSxHQUFHVixNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxRQUFsQixFQUE0QlcsT0FBNUIsQ0FBZjtBQUVBLFNBQU8sVUFBU0UsU0FBVCxFQUFvQjtBQUN2QixVQUFNQyxjQUFjLEdBQUdQLGtCQUFrQixDQUFDTSxTQUFELENBQXpDOztBQUVBLFFBQUksQ0FBQ0QsTUFBTSxDQUFDakIsUUFBWixFQUFzQjtBQUNsQixZQUFNb0Isb0JBQW9CLEdBQUdQLGVBQWUsQ0FBQ0ksTUFBRCxDQUFmLENBQ3pCRSxjQUR5QixDQUE3QjtBQUlBLGFBQU8sVUFBU0UsS0FBVCxFQUFnQjtBQUNuQixjQUFNQyxLQUFLLEdBQUdQLE9BQU8sQ0FBQ00sS0FBRCxDQUFyQjtBQUVBLGVBQU9aLEtBQUssQ0FBQ2MsYUFBTixDQUFvQkgsb0JBQXBCLEVBQTBDO0FBQzdDRSxlQUQ2QztBQUU3Q0QsZUFGNkM7QUFHN0NKO0FBSDZDLFNBQTFDLENBQVA7QUFLSCxPQVJEO0FBU0gsS0FkRCxNQWNPO0FBQ0gsYUFBT04saUJBQWlCLENBQUNJLE9BQUQsRUFBVUUsTUFBVixFQUFrQkUsY0FBbEIsQ0FBeEI7QUFDSDtBQUNKLEdBcEJEO0FBcUJILENBakNELEU7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUlWLEtBQUo7QUFBVWYsTUFBTSxDQUFDQyxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDYSxTQUFLLEdBQUNiLENBQU47QUFBUTs7QUFBcEIsQ0FBcEIsRUFBMEMsQ0FBMUM7QUFBNkMsSUFBSTRCLGVBQUo7QUFBb0I5QixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDNkIsaUJBQWUsQ0FBQzVCLENBQUQsRUFBRztBQUFDNEIsbUJBQWUsR0FBQzVCLENBQWhCO0FBQWtCOztBQUF0QyxDQUF2QyxFQUErRSxDQUEvRTtBQUEzRUYsTUFBTSxDQUFDSyxhQUFQLENBR2UsQ0FBQ3VCLEtBQUQsRUFBUUosU0FBUixFQUFtQk8sT0FBTyxHQUFHLEVBQTdCLEtBQW9DO0FBQy9DLE1BQUlDLE1BQU0sQ0FBQ0MsYUFBWCxFQUEwQjtBQUN0QkMsV0FBTyxDQUFDQyxJQUFSLENBQWEsc0VBQWI7QUFDSDs7QUFFRCxNQUFJSixPQUFPLENBQUN6QixRQUFaLEVBQXNCO0FBQ2xCLFdBQU93QixlQUFlLENBQUVILEtBQUQsSUFBVztBQUM5QixVQUFJQSxLQUFLLENBQUNTLE1BQVYsRUFBa0I7QUFDZFIsYUFBSyxDQUFDUyxTQUFOLENBQWdCVixLQUFLLENBQUNTLE1BQXRCO0FBQ0g7O0FBRUQsWUFBTWYsT0FBTyxHQUFHTyxLQUFLLENBQUNVLFNBQU4sRUFBaEI7QUFFQTtBQUNJVixhQURKO0FBRUlXLGVBQU8sRUFBRSxDQUFDbEIsT0FBTyxDQUFDbUIsS0FBUixFQUZkO0FBR0ksU0FBQ1QsT0FBTyxDQUFDdkIsUUFBVCxHQUFvQnVCLE9BQU8sQ0FBQ3hCLE1BQVIsR0FBaUJrQyxDQUFDLENBQUNDLEtBQUYsQ0FBUWQsS0FBSyxDQUFDZSxLQUFOLEVBQVIsQ0FBakIsR0FBMENmLEtBQUssQ0FBQ2UsS0FBTjtBQUhsRSxTQUlPaEIsS0FKUDtBQU1ILEtBYnFCLEVBYW5CSCxTQWJtQixDQUF0QjtBQWNIOztBQUVELFFBQU1vQixvQkFBTixTQUFtQzdCLEtBQUssQ0FBQzhCLFNBQXpDLENBQW1EO0FBQy9DQyxlQUFXLEdBQUc7QUFDVjtBQUNBLFdBQUtDLEtBQUwsR0FBYTtBQUNULFNBQUNoQixPQUFPLENBQUN2QixRQUFULEdBQW9Cd0MsU0FEWDtBQUVUQyxhQUFLLEVBQUVELFNBRkU7QUFHVFQsZUFBTyxFQUFFO0FBSEEsT0FBYjtBQUtIOztBQUVEVyw2QkFBeUIsQ0FBQ0MsU0FBRCxFQUFZO0FBQ2pDLFdBQUtDLE1BQUwsQ0FBWUQsU0FBUyxDQUFDZixNQUF0QjtBQUNIOztBQUVEaUIscUJBQWlCLEdBQUc7QUFDaEIsV0FBS0QsTUFBTCxDQUFZLEtBQUt6QixLQUFMLENBQVdTLE1BQXZCO0FBQ0g7O0FBRURnQixVQUFNLENBQUNoQixNQUFELEVBQVM7QUFDWCxVQUFJQSxNQUFKLEVBQVk7QUFDUlIsYUFBSyxDQUFDUyxTQUFOLENBQWdCRCxNQUFoQjtBQUNIOztBQUVEUixXQUFLLENBQUNlLEtBQU4sQ0FBWSxDQUFDTSxLQUFELEVBQVFLLElBQVIsS0FBaUI7QUFDekIsY0FBTVAsS0FBSyxHQUFHO0FBQ1ZFLGVBRFU7QUFFVixXQUFDbEIsT0FBTyxDQUFDdkIsUUFBVCxHQUFvQnVCLE9BQU8sQ0FBQ3hCLE1BQVIsR0FBaUJrQyxDQUFDLENBQUNDLEtBQUYsQ0FBUVksSUFBUixDQUFqQixHQUFpQ0EsSUFGM0M7QUFHVmYsaUJBQU8sRUFBRTtBQUhDLFNBQWQ7QUFNQSxhQUFLZ0IsUUFBTCxDQUFjUixLQUFkO0FBQ0gsT0FSRDtBQVNIOztBQUVEUyxVQUFNLEdBQUc7QUFDTCxZQUFNO0FBQUNULGFBQUQ7QUFBUXBCO0FBQVIsVUFBaUIsSUFBdkI7QUFFQSxhQUFPWixLQUFLLENBQUNjLGFBQU4sQ0FBb0JMLFNBQXBCO0FBQ0hJO0FBREcsU0FFQW1CLEtBRkEsRUFHQXBCLEtBSEEsRUFBUDtBQUtIOztBQTFDOEM7O0FBNkNuRGlCLHNCQUFvQixDQUFDYSxTQUFyQixHQUFpQztBQUM3QnJCLFVBQU0sRUFBRXJCLEtBQUssQ0FBQzJDLFNBQU4sQ0FBZ0JDO0FBREssR0FBakM7QUFJQSxTQUFPZixvQkFBUDtBQUNILENBM0VELEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTdCLEtBQUo7QUFBVWYsTUFBTSxDQUFDQyxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDYSxTQUFLLEdBQUNiLENBQU47QUFBUTs7QUFBcEIsQ0FBcEIsRUFBMEMsQ0FBMUM7QUFBNkMsSUFBSTBELEtBQUosRUFBVUMsS0FBVjtBQUFnQjdELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQzJELE9BQUssQ0FBQzFELENBQUQsRUFBRztBQUFDMEQsU0FBSyxHQUFDMUQsQ0FBTjtBQUFRLEdBQWxCOztBQUFtQjJELE9BQUssQ0FBQzNELENBQUQsRUFBRztBQUFDMkQsU0FBSyxHQUFDM0QsQ0FBTjtBQUFROztBQUFwQyxDQUEzQixFQUFpRSxDQUFqRTtBQUF2RUYsTUFBTSxDQUFDSyxhQUFQLENBR2UsVUFBUzBCLE9BQVQsRUFBa0I7QUFDN0I2QixPQUFLLENBQUM3QixPQUFELEVBQVU7QUFDWHpCLFlBQVEsRUFBRXVELEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxPQUFaLENBREM7QUFFWHhELFVBQU0sRUFBRXNELEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxPQUFaLENBRkc7QUFHWEMsYUFBUyxFQUFFSCxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsTUFBWixDQUhBO0FBSVhDLGtCQUFjLEVBQUVMLEtBQUssQ0FBQ0MsS0FBTixDQUFZRCxLQUFLLENBQUNNLEdBQWxCLENBSkw7QUFLWEMsb0JBQWdCLEVBQUVQLEtBQUssQ0FBQ0MsS0FBTixDQUFZRCxLQUFLLENBQUNNLEdBQWxCLENBTFA7QUFNWDNELFlBQVEsRUFBRXFELEtBQUssQ0FBQ0MsS0FBTixDQUFZTyxNQUFaLENBTkM7QUFPWEMsaUJBQWEsRUFBRVQsS0FBSyxDQUFDQyxLQUFOLENBQVlDLE9BQVosQ0FQSjtBQVFYUSxpQkFBYSxFQUFFVixLQUFLLENBQUNDLEtBQU4sQ0FBWVUsUUFBWjtBQVJKLEdBQVYsQ0FBTDs7QUFXQSxNQUFJekMsT0FBTyxDQUFDekIsUUFBUixJQUFvQnlCLE9BQU8sQ0FBQzBDLElBQWhDLEVBQXNDO0FBQ2xDLFVBQU0sSUFBSXpDLE1BQU0sQ0FBQzBDLEtBQVgsQ0FDRCxpRUFEQyxDQUFOO0FBR0g7QUFDSixDQXBCRCxFOzs7Ozs7Ozs7OztBQ0FBMUUsTUFBTSxDQUFDUyxNQUFQLENBQWM7QUFBQ04sU0FBTyxFQUFDLE1BQUl3RTtBQUFiLENBQWQ7O0FBQWUsU0FBU0EsY0FBVCxDQUF3QkMsZ0JBQXhCLEVBQTBDO0FBQ3JELFNBQU9BLGdCQUFnQixDQUFDQyxXQUFqQixJQUFnQ0QsZ0JBQWdCLENBQUNFLElBQWpELElBQXlELFdBQWhFO0FBQ0gsQzs7Ozs7Ozs7Ozs7Ozs7O0FDRkQ5RSxNQUFNLENBQUNTLE1BQVAsQ0FBYztBQUFDTixTQUFPLEVBQUMsTUFBSWU7QUFBYixDQUFkO0FBQWdELElBQUlILEtBQUo7QUFBVWYsTUFBTSxDQUFDQyxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDYSxTQUFLLEdBQUNiLENBQU47QUFBUTs7QUFBcEIsQ0FBcEIsRUFBMEMsQ0FBMUM7QUFBNkMsSUFBSXdELFNBQUo7QUFBYzFELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ0UsU0FBTyxDQUFDRCxDQUFELEVBQUc7QUFBQ3dELGFBQVMsR0FBQ3hELENBQVY7QUFBWTs7QUFBeEIsQ0FBekIsRUFBbUQsQ0FBbkQ7QUFBc0QsSUFBSTZFLEtBQUosRUFBVUMsVUFBVjtBQUFxQmhGLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1DQUFaLEVBQWdEO0FBQUM4RSxPQUFLLENBQUM3RSxDQUFELEVBQUc7QUFBQzZFLFNBQUssR0FBQzdFLENBQU47QUFBUSxHQUFsQjs7QUFBbUI4RSxZQUFVLENBQUM5RSxDQUFELEVBQUc7QUFBQzhFLGNBQVUsR0FBQzlFLENBQVg7QUFBYTs7QUFBOUMsQ0FBaEQsRUFBZ0csQ0FBaEc7QUFBbUcsSUFBSXlFLGNBQUo7QUFBbUIzRSxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDRSxTQUFPLENBQUNELENBQUQsRUFBRztBQUFDeUUsa0JBQWMsR0FBQ3pFLENBQWY7QUFBaUI7O0FBQTdCLENBQS9CLEVBQThELENBQTlEO0FBQWlFLElBQUljLFdBQUo7QUFBZ0JoQixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDZSxhQUFXLENBQUNkLENBQUQsRUFBRztBQUFDYyxlQUFXLEdBQUNkLENBQVo7QUFBYzs7QUFBOUIsQ0FBdkMsRUFBdUUsQ0FBdkU7QUFNdlksTUFBTXVELFNBQVMsR0FBRztBQUNkd0IsU0FBTyxFQUFFdkIsU0FBUyxDQUFDd0IsS0FBVixDQUFnQjtBQUNyQkMsYUFBUyxFQUFFekIsU0FBUyxDQUFDMEIsSUFBVixDQUFlQyxVQURMO0FBRXJCcEMsU0FBSyxFQUFFUyxTQUFTLENBQUNDLE1BRkk7QUFHckJMLFFBQUksRUFBRUksU0FBUyxDQUFDNEIsS0FISztBQUlyQjFELFNBQUssRUFBRThCLFNBQVMsQ0FBQzZCLFNBQVYsQ0FBb0IsQ0FDdkI3QixTQUFTLENBQUM4QixVQUFWLENBQXFCVCxLQUFyQixDQUR1QixFQUV2QnJCLFNBQVMsQ0FBQzhCLFVBQVYsQ0FBcUJSLFVBQXJCLENBRnVCLENBQXBCO0FBSmMsR0FBaEIsRUFRTkssVUFUVztBQVVkOUQsUUFBTSxFQUFFbUMsU0FBUyxDQUFDQyxNQUFWLENBQWlCMEIsVUFWWDtBQVdkMUQsT0FBSyxFQUFFK0IsU0FBUyxDQUFDQztBQVhILENBQWxCOztBQWNlLFNBQVN6QyxrQkFBVCxDQUE0QjBELGdCQUE1QixFQUE4QztBQUN6RCxNQUFJYSxxQkFBcUIsR0FBRyxVQUFTO0FBQUNSLFdBQUQ7QUFBVTFELFVBQVY7QUFBa0JLLFNBQWxCO0FBQXlCRDtBQUF6QixHQUFULEVBQTBDO0FBQ2xFLFVBQU07QUFBQ3dELGVBQUQ7QUFBWWxDLFdBQVo7QUFBbUJLO0FBQW5CLFFBQTJCMkIsT0FBakM7O0FBRUEsUUFBSWhDLEtBQUssSUFBSTFCLE1BQU0sQ0FBQzJDLGNBQXBCLEVBQW9DO0FBQ2hDLGFBQU9uRCxLQUFLLENBQUNjLGFBQU4sQ0FBb0JOLE1BQU0sQ0FBQzJDLGNBQTNCLEVBQTJDO0FBQzlDakIsYUFEOEM7QUFFOUNyQjtBQUY4QyxPQUEzQyxDQUFQO0FBSUg7O0FBRUQsUUFBSXVELFNBQVMsSUFBSTVELE1BQU0sQ0FBQzZDLGdCQUF4QixFQUEwQztBQUN0QyxhQUFPckQsS0FBSyxDQUFDYyxhQUFOLENBQW9CTixNQUFNLENBQUM2QyxnQkFBM0IsRUFBNkM7QUFDaER4QztBQURnRCxPQUE3QyxDQUFQO0FBR0g7O0FBRUQsV0FBT2IsS0FBSyxDQUFDYyxhQUFOLENBQW9CK0MsZ0JBQXBCLGtDQUNBakQsS0FEQTtBQUVId0QsZUFBUyxFQUFFbEMsS0FBSyxHQUFHLEtBQUgsR0FBV2tDLFNBRnhCO0FBR0hsQyxXQUhHO0FBSUgsT0FBQzFCLE1BQU0sQ0FBQ2YsUUFBUixHQUFtQmUsTUFBTSxDQUFDaEIsTUFBUCxHQUFnQitDLElBQUksQ0FBQyxDQUFELENBQXBCLEdBQTBCQSxJQUoxQztBQUtIMUI7QUFMRyxPQUFQO0FBT0gsR0F2QkQ7O0FBeUJBNkQsdUJBQXFCLENBQUNoQyxTQUF0QixHQUFrQ0EsU0FBbEM7QUFDQWdDLHVCQUFxQixDQUFDWixXQUF0QixHQUFxQyxnQkFBZUYsY0FBYyxDQUFDQyxnQkFBRCxDQUFtQixHQUFyRjtBQUVBLFNBQU9hLHFCQUFQO0FBQ0gsQzs7Ozs7Ozs7Ozs7Ozs7O0FDbEREekYsTUFBTSxDQUFDUyxNQUFQLENBQWM7QUFBQ04sU0FBTyxFQUFDLE1BQUl1RjtBQUFiLENBQWQ7QUFBbUQsSUFBSTFFLFdBQUo7QUFBZ0JoQixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDZSxhQUFXLENBQUNkLENBQUQsRUFBRztBQUFDYyxlQUFXLEdBQUNkLENBQVo7QUFBYzs7QUFBOUIsQ0FBdkMsRUFBdUUsQ0FBdkU7QUFBMEUsSUFBSXlGLFdBQUo7QUFBZ0IzRixNQUFNLENBQUNDLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDMEYsYUFBVyxDQUFDekYsQ0FBRCxFQUFHO0FBQUN5RixlQUFXLEdBQUN6RixDQUFaO0FBQWM7O0FBQTlCLENBQWxDLEVBQWtFLENBQWxFOztBQVU5SSxTQUFTd0YscUJBQVQsQ0FBK0JyRSxPQUEvQixFQUF3Q0UsTUFBeEMsRUFBZ0RxRSxjQUFoRCxFQUFnRTtBQUMzRSxNQUFJQyxpQkFBaUIsR0FBRyxJQUFJRixXQUFKLEVBQXhCO0FBRUEsU0FBTzNFLFdBQVcsQ0FBRVcsS0FBRCxJQUFXO0FBQzFCLFVBQU1DLEtBQUssR0FBR1AsT0FBTyxDQUFDTSxLQUFELENBQXJCO0FBRUEsVUFBTW1FLGtCQUFrQixHQUFHbEUsS0FBSyxDQUFDVSxTQUFOLENBQWdCO0FBQ3ZDeUQsWUFBTSxDQUFDQyxHQUFELEVBQU07QUFDUixZQUFJQSxHQUFKLEVBQVM7QUFDTEgsMkJBQWlCLENBQUNJLEdBQWxCLENBQXNCRCxHQUF0QjtBQUNIO0FBQ0osT0FMc0M7O0FBTXZDRSxhQUFPLEdBQUc7QUFDTkwseUJBQWlCLENBQUNJLEdBQWxCLENBQXNCLElBQXRCO0FBQ0g7O0FBUnNDLEtBQWhCLENBQTNCO0FBV0EsVUFBTUUsT0FBTyxHQUFHTCxrQkFBa0IsQ0FBQ3RELEtBQW5CLEVBQWhCO0FBRUEsVUFBTWMsSUFBSSxHQUFHMUIsS0FBSyxDQUFDZSxLQUFOLEVBQWI7QUFFQSxXQUFPO0FBQ0hzQyxhQUFPLEVBQUU7QUFDTEUsaUJBQVMsRUFBRSxDQUFDZ0IsT0FEUDtBQUVMN0MsWUFGSztBQUdMTCxhQUFLLEVBQUU0QztBQUhGLE9BRE47QUFNSGpFLFdBTkc7QUFPSEwsWUFQRztBQVFISTtBQVJHLEtBQVA7QUFVSCxHQTVCaUIsQ0FBWCxDQTRCSnlFLFlBQVksQ0FBQ1IsY0FBRCxDQTVCUixDQUFQO0FBNkJIOztBQUVELE1BQU1RLFlBQVksR0FBR3BGLFdBQVcsQ0FBRVcsS0FBRCxJQUFXO0FBQ3hDLFFBQU1zQixLQUFLLEdBQUd0QixLQUFLLENBQUNzRCxPQUFOLENBQWNoQyxLQUFkLENBQW9Cb0QsR0FBcEIsRUFBZDtBQUVBLHlDQUNPMUUsS0FEUDtBQUVJc0QsV0FBTyxrQ0FDQXRELEtBQUssQ0FBQ3NELE9BRE47QUFFSGhDO0FBRkc7QUFGWDtBQU9ILENBVitCLENBQWhDLEM7Ozs7Ozs7Ozs7Ozs7OztBQzVDQWpELE1BQU0sQ0FBQ1MsTUFBUCxDQUFjO0FBQUNOLFNBQU8sRUFBQyxNQUFJbUc7QUFBYixDQUFkO0FBQXNELElBQUl2RixLQUFKO0FBQVVmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLE9BQVosRUFBb0I7QUFBQ0UsU0FBTyxDQUFDRCxDQUFELEVBQUc7QUFBQ2EsU0FBSyxHQUFDYixDQUFOO0FBQVE7O0FBQXBCLENBQXBCLEVBQTBDLENBQTFDO0FBQTZDLElBQUl5RSxjQUFKO0FBQW1CM0UsTUFBTSxDQUFDQyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ0UsU0FBTyxDQUFDRCxDQUFELEVBQUc7QUFBQ3lFLGtCQUFjLEdBQUN6RSxDQUFmO0FBQWlCOztBQUE3QixDQUEvQixFQUE4RCxDQUE5RDs7QUFHakgsU0FBU29HLHdCQUFULENBQWtDL0UsTUFBbEMsRUFBMEM7QUFDckQsU0FBTyxVQUFTcUQsZ0JBQVQsRUFBMkI7QUFDOUI7Ozs7QUFJQSxVQUFNMkIsMkJBQU4sU0FBMEN4RixLQUFLLENBQUM4QixTQUFoRCxDQUEwRDtBQUFBO0FBQUE7QUFBQSxhQUN0REUsS0FEc0QsR0FDOUM7QUFDSm9DLG1CQUFTLEVBQUUsSUFEUDtBQUVKbEMsZUFBSyxFQUFFLElBRkg7QUFHSkssY0FBSSxFQUFFO0FBSEYsU0FEOEM7O0FBQUEsYUFrRHREa0QsT0FsRHNELEdBa0Q1QyxNQUFNO0FBQ1osZ0JBQU07QUFBRWxDLHlCQUFhLEdBQUc7QUFBbEIsY0FBMkIvQyxNQUFqQztBQUNBLGdCQUFNO0FBQUVLO0FBQUYsY0FBWSxLQUFLRCxLQUF2Qjs7QUFFQSxjQUFJMkMsYUFBSixFQUFtQjtBQUNmLGlCQUFLZixRQUFMLENBQWM7QUFBRTRCLHVCQUFTLEVBQUU7QUFBYixhQUFkLEVBQW1DLE1BQU07QUFDckMsbUJBQUt4QyxLQUFMLENBQVdmLEtBQVg7QUFDSCxhQUZEO0FBR0gsV0FKRCxNQUlPO0FBQ0gsaUJBQUtlLEtBQUwsQ0FBV2YsS0FBWDtBQUNIO0FBQ0osU0E3RHFEO0FBQUE7O0FBT3REc0IsK0JBQXlCLENBQUNDLFNBQUQsRUFBWTtBQUNqQyxjQUFNO0FBQUV2QjtBQUFGLFlBQVl1QixTQUFsQjs7QUFFQSxZQUFJLENBQUM1QixNQUFNLENBQUNnRCxhQUFaLEVBQTJCO0FBQ3ZCLGVBQUs1QixLQUFMLENBQVdmLEtBQVg7QUFDSCxTQUZELE1BRU8sSUFBSUwsTUFBTSxDQUFDZ0QsYUFBUCxDQUFxQixLQUFLNUMsS0FBMUIsRUFBaUN3QixTQUFqQyxDQUFKLEVBQWlEO0FBQ3BELGVBQUtSLEtBQUwsQ0FBV2YsS0FBWDtBQUNIO0FBQ0o7O0FBRUR5Qix1QkFBaUIsR0FBRztBQUNoQixjQUFNO0FBQUV6QixlQUFGO0FBQVNMO0FBQVQsWUFBb0IsS0FBS0ksS0FBL0I7QUFDQSxhQUFLZ0IsS0FBTCxDQUFXZixLQUFYOztBQUVBLFlBQUlMLE1BQU0sQ0FBQ3lDLFNBQVgsRUFBc0I7QUFDbEIsZUFBS3lDLGVBQUwsR0FBdUJDLFdBQVcsQ0FBQyxNQUFNO0FBQ3JDLGlCQUFLL0QsS0FBTCxDQUFXZixLQUFYO0FBQ0gsV0FGaUMsRUFFL0JMLE1BQU0sQ0FBQ3lDLFNBRndCLENBQWxDO0FBR0g7QUFDSjs7QUFFRDJDLDBCQUFvQixHQUFHO0FBQ25CLGFBQUtGLGVBQUwsSUFBd0JHLGFBQWEsQ0FBQyxLQUFLSCxlQUFOLENBQXJDO0FBQ0g7O0FBRUQ5RCxXQUFLLENBQUNmLEtBQUQsRUFBUTtBQUNUQSxhQUFLLENBQUNlLEtBQU4sQ0FBWSxDQUFDTSxLQUFELEVBQVFLLElBQVIsS0FBaUI7QUFDekIsY0FBSUwsS0FBSixFQUFXO0FBQ1AsaUJBQUtNLFFBQUwsQ0FBYztBQUNWTixtQkFEVTtBQUVWSyxrQkFBSSxFQUFFLEVBRkk7QUFHVjZCLHVCQUFTLEVBQUU7QUFIRCxhQUFkO0FBS0gsV0FORCxNQU1PO0FBQ0gsaUJBQUs1QixRQUFMLENBQWM7QUFDVk4sbUJBQUssRUFBRSxJQURHO0FBRVZLLGtCQUZVO0FBR1Y2Qix1QkFBUyxFQUFFO0FBSEQsYUFBZDtBQUtIO0FBQ0osU0FkRDtBQWVIOztBQWVEM0IsWUFBTSxHQUFHO0FBQ0wsY0FBTTtBQUFFakMsZ0JBQUY7QUFBVUksZUFBVjtBQUFpQkM7QUFBakIsWUFBMkIsS0FBS0QsS0FBdEM7QUFFQSxlQUFPWixLQUFLLENBQUNjLGFBQU4sQ0FBb0IrQyxnQkFBcEIsRUFBc0M7QUFDekNLLGlCQUFPLEVBQUUsS0FBS2xDLEtBRDJCO0FBRXpDeEIsZ0JBRnlDO0FBR3pDSyxlQUh5QztBQUl6Q0QsZUFBSyxrQ0FBT0EsS0FBUDtBQUFjNkUsbUJBQU8sRUFBRSxLQUFLQTtBQUE1QjtBQUpvQyxTQUF0QyxDQUFQO0FBTUg7O0FBeEVxRDs7QUEyRTFERCwrQkFBMkIsQ0FBQzFCLFdBQTVCLEdBQTJDLGVBQWNGLGNBQWMsQ0FDbkVDLGdCQURtRSxDQUVyRSxHQUZGO0FBSUEsV0FBTzJCLDJCQUFQO0FBQ0gsR0FyRkQ7QUFzRkgsQyIsImZpbGUiOiIvcGFja2FnZXMvY3VsdG9mY29kZXJzX2dyYXBoZXItcmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5cbmNoZWNrTnBtVmVyc2lvbnMoe1xuICAgIHJlYWN0OiAnMTUuMyAtIDE2JyxcbiAgICAncHJvcC10eXBlcyc6ICcxNS4wIC0gMTYnLFxufSwgJ2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0Jyk7XG5cbmV4cG9ydCB7XG4gICAgZGVmYXVsdCBhcyBzZXREZWZhdWx0c1xufSBmcm9tICcuL3NldERlZmF1bHRzLmpzJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIHdpdGhRdWVyeVxufSBmcm9tICcuL3dpdGhRdWVyeS5qcyc7XG5cbmV4cG9ydCB7XG4gICAgZGVmYXVsdCBhcyBjcmVhdGVRdWVyeUNvbnRhaW5lclxufSBmcm9tICcuL2xlZ2FjeS9jcmVhdGVRdWVyeUNvbnRhaW5lci5qcyc7IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlYWN0aXZlOiBmYWxzZSxcbiAgICBzaW5nbGU6IGZhbHNlLFxuICAgIGRhdGFQcm9wOiAnZGF0YScsXG59XG4iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldERlZmF1bHRzKG5ld0RlZmF1bHRzKSB7XG4gICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgbmV3RGVmYXVsdHMpO1xufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cyc7XG5pbXBvcnQgeyB3aXRoVHJhY2tlciB9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5pbXBvcnQgd2l0aFJlYWN0aXZlUXVlcnkgZnJvbSAnLi9saWIvd2l0aFJlYWN0aXZlUXVlcnknO1xuaW1wb3J0IHdpdGhRdWVyeUNvbnRhaW5lciBmcm9tICcuL2xpYi93aXRoUXVlcnlDb250YWluZXInO1xuaW1wb3J0IHdpdGhTdGF0aWNRdWVyeSBmcm9tICcuL2xpYi93aXRoU3RhdGljUXVlcnknO1xuaW1wb3J0IGNoZWNrT3B0aW9ucyBmcm9tICcuL2xpYi9jaGVja09wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihoYW5kbGVyLCBfY29uZmlnID0ge30pIHtcbiAgICBjaGVja09wdGlvbnMoX2NvbmZpZyk7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIF9jb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBxdWVyeUNvbnRhaW5lciA9IHdpdGhRdWVyeUNvbnRhaW5lcihjb21wb25lbnQpO1xuXG4gICAgICAgIGlmICghY29uZmlnLnJlYWN0aXZlKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNRdWVyeUNvbnRhaW5lciA9IHdpdGhTdGF0aWNRdWVyeShjb25maWcpKFxuICAgICAgICAgICAgICAgIHF1ZXJ5Q29udGFpbmVyLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBoYW5kbGVyKHByb3BzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHN0YXRpY1F1ZXJ5Q29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3aXRoUmVhY3RpdmVRdWVyeShoYW5kbGVyLCBjb25maWcsIHF1ZXJ5Q29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVDb250YWluZXJ9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5cbmV4cG9ydCBkZWZhdWx0IChxdWVyeSwgY29tcG9uZW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgICBpZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdjcmVhdGVRdWVyeUNvbnRhaW5lcigpIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2Ugd2l0aFF1ZXJ5KCkgaW5zdGVhZCcpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVhY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRhaW5lcigocHJvcHMpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5zZXRQYXJhbXMocHJvcHMucGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHF1ZXJ5LnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6ICFoYW5kbGVyLnJlYWR5KCksXG4gICAgICAgICAgICAgICAgW29wdGlvbnMuZGF0YVByb3BdOiBvcHRpb25zLnNpbmdsZSA/IF8uZmlyc3QocXVlcnkuZmV0Y2goKSkgOiBxdWVyeS5mZXRjaCgpLFxuICAgICAgICAgICAgICAgIC4uLnByb3BzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgY2xhc3MgTWV0aG9kUXVlcnlDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIFtvcHRpb25zLmRhdGFQcm9wXTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZldGNoKG5leHRQcm9wcy5wYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9mZXRjaCh0aGlzLnByb3BzLnBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBfZmV0Y2gocGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuc2V0UGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1ZXJ5LmZldGNoKChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgW29wdGlvbnMuZGF0YVByb3BdOiBvcHRpb25zLnNpbmdsZSA/IF8uZmlyc3QoZGF0YSkgOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3Qge3N0YXRlLCBwcm9wc30gPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChjb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICAuLi5wcm9wc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1ldGhvZFF1ZXJ5Q29tcG9uZW50LnByb3BUeXBlcyA9IHtcbiAgICAgICAgcGFyYW1zOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG4gICAgfTtcblxuICAgIHJldHVybiBNZXRob2RRdWVyeUNvbXBvbmVudDtcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY2hlY2ssIE1hdGNoIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGNoZWNrKG9wdGlvbnMsIHtcbiAgICAgICAgcmVhY3RpdmU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgICAgICBzaW5nbGU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgICAgICBwb2xsaW5nTXM6IE1hdGNoLk1heWJlKE51bWJlciksXG4gICAgICAgIGVycm9yQ29tcG9uZW50OiBNYXRjaC5NYXliZShNYXRjaC5BbnkpLFxuICAgICAgICBsb2FkaW5nQ29tcG9uZW50OiBNYXRjaC5NYXliZShNYXRjaC5BbnkpLFxuICAgICAgICBkYXRhUHJvcDogTWF0Y2guTWF5YmUoU3RyaW5nKSxcbiAgICAgICAgbG9hZE9uUmVmZXRjaDogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgICAgIHNob3VsZFJlZmV0Y2g6IE1hdGNoLk1heWJlKEZ1bmN0aW9uKSxcbiAgICB9KTtcblxuICAgIGlmIChvcHRpb25zLnJlYWN0aXZlICYmIG9wdGlvbnMucG9sbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgYFlvdSBjYW5ub3QgaGF2ZSBhIHF1ZXJ5IHRoYXQgaXMgcmVhY3RpdmUgYW5kIGl0IGlzIHdpdGggcG9sbGluZ2BcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREaXNwbGF5TmFtZShXcmFwcGVkQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIFdyYXBwZWRDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgV3JhcHBlZENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtRdWVyeSwgTmFtZWRRdWVyeX0gZnJvbSAnbWV0ZW9yL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0JztcbmltcG9ydCBnZXREaXNwbGF5TmFtZSBmcm9tICcuL2dldERpc3BsYXlOYW1lJztcbmltcG9ydCB7d2l0aFRyYWNrZXJ9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgICBncmFwaGVyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICAgIGVycm9yOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBkYXRhOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIHF1ZXJ5OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5pbnN0YW5jZU9mKFF1ZXJ5KSxcbiAgICAgICAgICAgIFByb3BUeXBlcy5pbnN0YW5jZU9mKE5hbWVkUXVlcnkpLFxuICAgICAgICBdKVxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvcHM6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3aXRoUXVlcnlDb250YWluZXIoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIGxldCBHcmFwaGVyUXVlcnlDb250YWluZXIgPSBmdW5jdGlvbih7Z3JhcGhlciwgY29uZmlnLCBxdWVyeSwgcHJvcHN9KSB7XG4gICAgICAgIGNvbnN0IHtpc0xvYWRpbmcsIGVycm9yLCBkYXRhfSA9IGdyYXBoZXI7XG5cbiAgICAgICAgaWYgKGVycm9yICYmIGNvbmZpZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29uZmlnLmVycm9yQ29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTG9hZGluZyAmJiBjb25maWcubG9hZGluZ0NvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29uZmlnLmxvYWRpbmdDb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXcmFwcGVkQ29tcG9uZW50LCB7XG4gICAgICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgICAgIGlzTG9hZGluZzogZXJyb3IgPyBmYWxzZSA6IGlzTG9hZGluZyxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgW2NvbmZpZy5kYXRhUHJvcF06IGNvbmZpZy5zaW5nbGUgPyBkYXRhWzBdIDogZGF0YSxcbiAgICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIEdyYXBoZXJRdWVyeUNvbnRhaW5lci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4gICAgR3JhcGhlclF1ZXJ5Q29udGFpbmVyLmRpc3BsYXlOYW1lID0gYEdyYXBoZXJRdWVyeSgke2dldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpfSlgO1xuXG4gICAgcmV0dXJuIEdyYXBoZXJRdWVyeUNvbnRhaW5lcjtcbn1cbiIsImltcG9ydCB7d2l0aFRyYWNrZXJ9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5pbXBvcnQge1JlYWN0aXZlVmFyfSBmcm9tICdtZXRlb3IvcmVhY3RpdmUtdmFyJztcblxuLyoqXG4gKiBXcmFwcyB0aGUgcXVlcnkgYW5kIHByb3ZpZGVzIHJlYWN0aXZlIGRhdGEgZmV0Y2hpbmcgdXRpbGl0eVxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcGFyYW0gUXVlcnlDb21wb25lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2l0aFJlYWN0aXZlQ29udGFpbmVyKGhhbmRsZXIsIGNvbmZpZywgUXVlcnlDb21wb25lbnQpIHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uRXJyb3IgPSBuZXcgUmVhY3RpdmVWYXIoKTtcblxuICAgIHJldHVybiB3aXRoVHJhY2tlcigocHJvcHMpID0+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBoYW5kbGVyKHByb3BzKTtcblxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25IYW5kbGUgPSBxdWVyeS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgb25TdG9wKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRXJyb3Iuc2V0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uUmVhZHkoKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRXJyb3Iuc2V0KG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBpc1JlYWR5ID0gc3Vic2NyaXB0aW9uSGFuZGxlLnJlYWR5KCk7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHF1ZXJ5LmZldGNoKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdyYXBoZXI6IHtcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc6ICFpc1JlYWR5LFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHN1YnNjcmlwdGlvbkVycm9yLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgIH1cbiAgICB9KShlcnJvclRyYWNrZXIoUXVlcnlDb21wb25lbnQpKVxufVxuXG5jb25zdCBlcnJvclRyYWNrZXIgPSB3aXRoVHJhY2tlcigocHJvcHMpID0+IHtcbiAgICBjb25zdCBlcnJvciA9IHByb3BzLmdyYXBoZXIuZXJyb3IuZ2V0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgZ3JhcGhlcjoge1xuICAgICAgICAgICAgLi4ucHJvcHMuZ3JhcGhlcixcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2V0RGlzcGxheU5hbWUgZnJvbSAnLi9nZXREaXNwbGF5TmFtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdpdGhTdGF0aWNRdWVyeUNvbnRhaW5lcihjb25maWcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oV3JhcHBlZENvbXBvbmVudCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogV2UgdXNlIGl0IGxpa2UgdGhpcyBzbyB3ZSBjYW4gaGF2ZSBuYW1pbmcgaW5zaWRlIFJlYWN0IERldiBUb29sc1xuICAgICAgICAgKiBUaGlzIGlzIGEgc3RhbmRhcmQgcGF0dGVybiBpbiBIT0NzXG4gICAgICAgICAqL1xuICAgICAgICBjbGFzcyBHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgICAgc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHF1ZXJ5IH0gPSBuZXh0UHJvcHM7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFjb25maWcuc2hvdWxkUmVmZXRjaCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5zaG91bGRSZWZldGNoKHRoaXMucHJvcHMsIG5leHRQcm9wcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaChxdWVyeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHF1ZXJ5LCBjb25maWcgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaChxdWVyeSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLnBvbGxpbmdNcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2gocXVlcnkpO1xuICAgICAgICAgICAgICAgICAgICB9LCBjb25maWcucG9sbGluZ01zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9sbGluZ0ludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5wb2xsaW5nSW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmZXRjaChxdWVyeSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LmZldGNoKChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlZmV0Y2ggPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsb2FkT25SZWZldGNoID0gdHJ1ZSB9ID0gY29uZmlnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcXVlcnkgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgICAgICAgICBpZiAobG9hZE9uUmVmZXRjaCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiB0cnVlIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2gocXVlcnkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb25maWcsIHByb3BzLCBxdWVyeSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdyYXBwZWRDb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhlcjogdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHsgLi4ucHJvcHMsIHJlZmV0Y2g6IHRoaXMucmVmZXRjaCB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgR3JhcGhlclN0YXRpY1F1ZXJ5Q29udGFpbmVyLmRpc3BsYXlOYW1lID0gYFN0YXRpY1F1ZXJ5KCR7Z2V0RGlzcGxheU5hbWUoXG4gICAgICAgICAgICBXcmFwcGVkQ29tcG9uZW50LFxuICAgICAgICApfSlgO1xuXG4gICAgICAgIHJldHVybiBHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXI7XG4gICAgfTtcbn1cbiJdfQ==
