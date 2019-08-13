//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher-react":{"main.client.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/main.client.js                                                       //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/defaults.js                                                          //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
module.exportDefault({
  reactive: false,
  single: false,
  dataProp: 'data'
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDefaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/setDefaults.js                                                       //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/withQuery.js                                                         //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.exportDefault(function (handler) {
  let _config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"legacy":{"createQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/legacy/createQueryContainer.js                                       //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.exportDefault(function (query, component) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"checkOptions.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/lib/checkOptions.js                                                  //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    throw new Meteor.Error("You cannot have a query that is reactive and it is with polling");
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDisplayName.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/lib/getDisplayName.js                                                //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
module.export({
  default: () => getDisplayName
});

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/lib/withQueryContainer.js                                            //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  let GrapherQueryContainer = function (_ref) {
    let {
      grapher,
      config,
      query,
      props
    } = _ref;
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
  GrapherQueryContainer.displayName = "GrapherQuery(".concat(getDisplayName(WrappedComponent), ")");
  return GrapherQueryContainer;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withReactiveQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/lib/withReactiveQuery.js                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withStaticQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/cultofcoders_grapher-react/lib/withStaticQuery.js                                               //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      constructor() {
        super(...arguments);
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

    GrapherStaticQueryContainer.displayName = "StaticQuery(".concat(getDisplayName(WrappedComponent), ")");
    return GrapherStaticQueryContainer;
  };
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher-react/main.client.js");

/* Exports */
Package._define("cultofcoders:grapher-react", exports);

})();
