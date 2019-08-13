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
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher-react":{"main.client.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/main.client.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions: function (v) {
    checkNpmVersions = v;
  }
}, 0);
module.link("./setDefaults.js", {
  "default": "setDefaults"
}, 1);
module.link("./withQuery.js", {
  "default": "withQuery"
}, 2);
module.link("./legacy/createQueryContainer.js", {
  "default": "createQueryContainer"
}, 3);
checkNpmVersions({
  react: '15.3 - 16',
  'prop-types': '15.0 - 16'
}, 'cultofcoders:grapher-react');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/defaults.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.exportDefault({
  reactive: false,
  single: false,
  dataProp: 'data'
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDefaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/setDefaults.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.export({
  "default": function () {
    return setDefaults;
  }
});
var defaults;
module.link("./defaults", {
  "default": function (v) {
    defaults = v;
  }
}, 0);

function setDefaults(newDefaults) {
  Object.assign(defaults, newDefaults);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/withQuery.js                                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var defaults;
module.link("./defaults", {
  "default": function (v) {
    defaults = v;
  }
}, 1);
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 2);
var withReactiveQuery;
module.link("./lib/withReactiveQuery", {
  "default": function (v) {
    withReactiveQuery = v;
  }
}, 3);
var withQueryContainer;
module.link("./lib/withQueryContainer", {
  "default": function (v) {
    withQueryContainer = v;
  }
}, 4);
var withStaticQuery;
module.link("./lib/withStaticQuery", {
  "default": function (v) {
    withStaticQuery = v;
  }
}, 5);
var checkOptions;
module.link("./lib/checkOptions", {
  "default": function (v) {
    checkOptions = v;
  }
}, 6);
module.exportDefault(function (handler) {
  var _config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  checkOptions(_config);
  var config = Object.assign({}, defaults, _config);
  return function (component) {
    var queryContainer = withQueryContainer(component);

    if (!config.reactive) {
      var staticQueryContainer = withStaticQuery(config)(queryContainer);
      return function (props) {
        var query = handler(props);
        return React.createElement(staticQueryContainer, {
          query: query,
          props: props,
          config: config
        });
      };
    } else {
      return withReactiveQuery(handler, config, queryContainer);
    }
  };
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"legacy":{"createQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/legacy/createQueryContainer.js                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var createContainer;
module.link("meteor/react-meteor-data", {
  createContainer: function (v) {
    createContainer = v;
  }
}, 1);
module.exportDefault(function (query, component) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (Meteor.isDevelopment) {
    console.warn('createQueryContainer() is deprecated, please use withQuery() instead');
  }

  if (options.reactive) {
    return createContainer(function (props) {
      var _objectSpread2;

      if (props.params) {
        query.setParams(props.params);
      }

      var handler = query.subscribe();
      return (0, _objectSpread3.default)((_objectSpread2 = {
        query: query,
        loading: !handler.ready()
      }, _objectSpread2[options.dataProp] = options.single ? _.first(query.fetch()) : query.fetch(), _objectSpread2), props);
    }, component);
  }

  var MethodQueryComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inheritsLoose2.default)(MethodQueryComponent, _React$Component);

    function MethodQueryComponent() {
      var _this$state;

      var _this;

      _this = _React$Component.call(this) || this;
      _this.state = (_this$state = {}, _this$state[options.dataProp] = undefined, _this$state.error = undefined, _this$state.loading = true, _this$state);
      return _this;
    }

    var _proto = MethodQueryComponent.prototype;

    _proto.componentWillReceiveProps = function () {
      function componentWillReceiveProps(nextProps) {
        this._fetch(nextProps.params);
      }

      return componentWillReceiveProps;
    }();

    _proto.componentDidMount = function () {
      function componentDidMount() {
        this._fetch(this.props.params);
      }

      return componentDidMount;
    }();

    _proto._fetch = function () {
      function _fetch(params) {
        var _this2 = this;

        if (params) {
          query.setParams(params);
        }

        query.fetch(function (error, data) {
          var _state;

          var state = (_state = {
            error: error
          }, _state[options.dataProp] = options.single ? _.first(data) : data, _state.loading = false, _state);

          _this2.setState(state);
        });
      }

      return _fetch;
    }();

    _proto.render = function () {
      function render() {
        var state = this.state,
            props = this.props;
        return React.createElement(component, (0, _objectSpread3.default)({
          query: query
        }, state, props));
      }

      return render;
    }();

    return MethodQueryComponent;
  }(React.Component);

  MethodQueryComponent.propTypes = {
    params: React.PropTypes.object
  };
  return MethodQueryComponent;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"checkOptions.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/lib/checkOptions.js                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var check, Match;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDisplayName.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/lib/getDisplayName.js                                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.export({
  "default": function () {
    return getDisplayName;
  }
});

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/lib/withQueryContainer.js                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  "default": function () {
    return withQueryContainer;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var Query, NamedQuery;
module.link("meteor/cultofcoders:grapher-react", {
  Query: function (v) {
    Query = v;
  },
  NamedQuery: function (v) {
    NamedQuery = v;
  }
}, 2);
var getDisplayName;
module.link("./getDisplayName", {
  "default": function (v) {
    getDisplayName = v;
  }
}, 3);
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 4);
var propTypes = {
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
  var GrapherQueryContainer = function (_ref) {
    var _objectSpread2;

    var grapher = _ref.grapher,
        config = _ref.config,
        query = _ref.query,
        props = _ref.props;
    var isLoading = grapher.isLoading,
        error = grapher.error,
        data = grapher.data;

    if (error && config.errorComponent) {
      return React.createElement(config.errorComponent, {
        error: error,
        query: query
      });
    }

    if (isLoading && config.loadingComponent) {
      return React.createElement(config.loadingComponent, {
        query: query
      });
    }

    return React.createElement(WrappedComponent, (0, _objectSpread3.default)({}, props, (_objectSpread2 = {
      isLoading: error ? false : isLoading,
      error: error
    }, _objectSpread2[config.dataProp] = config.single ? data[0] : data, _objectSpread2.query = query, _objectSpread2)));
  };

  GrapherQueryContainer.propTypes = propTypes;
  GrapherQueryContainer.displayName = "GrapherQuery(" + getDisplayName(WrappedComponent) + ")";
  return GrapherQueryContainer;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withReactiveQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/lib/withReactiveQuery.js                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  "default": function () {
    return withReactiveContainer;
  }
});
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 0);
var ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar: function (v) {
    ReactiveVar = v;
  }
}, 1);

function withReactiveContainer(handler, config, QueryComponent) {
  var subscriptionError = new ReactiveVar();
  return withTracker(function (props) {
    var query = handler(props);
    var subscriptionHandle = query.subscribe({
      onStop: function (err) {
        if (err) {
          subscriptionError.set(err);
        }
      },
      onReady: function () {
        subscriptionError.set(null);
      }
    });
    var isReady = subscriptionHandle.ready();
    var data = query.fetch();
    return {
      grapher: {
        isLoading: !isReady,
        data: data,
        error: subscriptionError
      },
      query: query,
      config: config,
      props: props
    };
  })(errorTracker(QueryComponent));
}

var errorTracker = withTracker(function (props) {
  var error = props.grapher.error.get();
  return (0, _objectSpread2.default)({}, props, {
    grapher: (0, _objectSpread2.default)({}, props.grapher, {
      error: error
    })
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withStaticQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cultofcoders_grapher-react/lib/withStaticQuery.js                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return withStaticQueryContainer;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var getDisplayName;
module.link("./getDisplayName", {
  "default": function (v) {
    getDisplayName = v;
  }
}, 1);

function withStaticQueryContainer(config) {
  return function (WrappedComponent) {
    /**
     * We use it like this so we can have naming inside React Dev Tools
     * This is a standard pattern in HOCs
     */
    var GrapherStaticQueryContainer =
    /*#__PURE__*/
    function (_React$Component) {
      (0, _inheritsLoose2.default)(GrapherStaticQueryContainer, _React$Component);

      function GrapherStaticQueryContainer() {
        var _this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.state = {
          isLoading: true,
          error: null,
          data: []
        };

        _this.refetch = function () {
          var _config$loadOnRefetch = config.loadOnRefetch,
              loadOnRefetch = _config$loadOnRefetch === void 0 ? true : _config$loadOnRefetch;
          var query = _this.props.query;

          if (loadOnRefetch) {
            _this.setState({
              isLoading: true
            }, function () {
              _this.fetch(query);
            });
          } else {
            _this.fetch(query);
          }
        };

        return _this;
      }

      var _proto = GrapherStaticQueryContainer.prototype;

      _proto.componentWillReceiveProps = function () {
        function componentWillReceiveProps(nextProps) {
          var query = nextProps.query;

          if (!config.shouldRefetch) {
            this.fetch(query);
          } else if (config.shouldRefetch(this.props, nextProps)) {
            this.fetch(query);
          }
        }

        return componentWillReceiveProps;
      }();

      _proto.componentDidMount = function () {
        function componentDidMount() {
          var _this2 = this;

          var _this$props = this.props,
              query = _this$props.query,
              config = _this$props.config;
          this.fetch(query);

          if (config.pollingMs) {
            this.pollingInterval = setInterval(function () {
              _this2.fetch(query);
            }, config.pollingMs);
          }
        }

        return componentDidMount;
      }();

      _proto.componentWillUnmount = function () {
        function componentWillUnmount() {
          this.pollingInterval && clearInterval(this.pollingInterval);
        }

        return componentWillUnmount;
      }();

      _proto.fetch = function () {
        function fetch(query) {
          var _this3 = this;

          query.fetch(function (error, data) {
            if (error) {
              _this3.setState({
                error: error,
                data: [],
                isLoading: false
              });
            } else {
              _this3.setState({
                error: null,
                data: data,
                isLoading: false
              });
            }
          });
        }

        return fetch;
      }();

      _proto.render = function () {
        function render() {
          var _this$props2 = this.props,
              config = _this$props2.config,
              props = _this$props2.props,
              query = _this$props2.query;
          return React.createElement(WrappedComponent, {
            grapher: this.state,
            config: config,
            query: query,
            props: (0, _objectSpread2.default)({}, props, {
              refetch: this.refetch
            })
          });
        }

        return render;
      }();

      return GrapherStaticQueryContainer;
    }(React.Component);

    GrapherStaticQueryContainer.displayName = "StaticQuery(" + getDisplayName(WrappedComponent) + ")";
    return GrapherStaticQueryContainer;
  };
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
