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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/main.client.js                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
module.watch(require("./setDefaults.js"), {                                                            // 1
    "default": function (v) {                                                                          // 1
        exports.setDefaults = v;                                                                       // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
module.watch(require("./withQuery.js"), {                                                              // 1
    "default": function (v) {                                                                          // 1
        exports.withQuery = v;                                                                         // 1
    }                                                                                                  // 1
}, 2);                                                                                                 // 1
module.watch(require("./legacy/createQueryContainer.js"), {                                            // 1
    "default": function (v) {                                                                          // 1
        exports.createQueryContainer = v;                                                              // 1
    }                                                                                                  // 1
}, 3);                                                                                                 // 1
var checkNpmVersions = void 0;                                                                         // 1
module.watch(require("meteor/tmeasday:check-npm-versions"), {                                          // 1
    checkNpmVersions: function (v) {                                                                   // 1
        checkNpmVersions = v;                                                                          // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
checkNpmVersions({                                                                                     // 3
    react: '15.3 - 16',                                                                                // 4
    'prop-types': '15.0 - 16'                                                                          // 5
}, 'cultofcoders:grapher-react');                                                                      // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/defaults.js                                                     //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
module.exportDefault({                                                                                 // 1
    reactive: false,                                                                                   // 2
    single: false                                                                                      // 3
});                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDefaults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/setDefaults.js                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
module.export({                                                                                        // 1
    "default": function () {                                                                           // 1
        return setDefaults;                                                                            // 1
    }                                                                                                  // 1
});                                                                                                    // 1
var defaults = void 0;                                                                                 // 1
module.watch(require("./defaults"), {                                                                  // 1
    "default": function (v) {                                                                          // 1
        defaults = v;                                                                                  // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
                                                                                                       //
function setDefaults(newDefaults) {                                                                    // 3
    Object.assign(defaults, newDefaults);                                                              // 4
}                                                                                                      // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQuery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/withQuery.js                                                    //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var React = void 0;                                                                                    // 1
module.watch(require("react"), {                                                                       // 1
    "default": function (v) {                                                                          // 1
        React = v;                                                                                     // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var defaults = void 0;                                                                                 // 1
module.watch(require("./defaults"), {                                                                  // 1
    "default": function (v) {                                                                          // 1
        defaults = v;                                                                                  // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
var withTracker = void 0;                                                                              // 1
module.watch(require("meteor/react-meteor-data"), {                                                    // 1
    withTracker: function (v) {                                                                        // 1
        withTracker = v;                                                                               // 1
    }                                                                                                  // 1
}, 2);                                                                                                 // 1
var withReactiveQuery = void 0;                                                                        // 1
module.watch(require("./lib/withReactiveQuery"), {                                                     // 1
    "default": function (v) {                                                                          // 1
        withReactiveQuery = v;                                                                         // 1
    }                                                                                                  // 1
}, 3);                                                                                                 // 1
var withQueryContainer = void 0;                                                                       // 1
module.watch(require("./lib/withQueryContainer"), {                                                    // 1
    "default": function (v) {                                                                          // 1
        withQueryContainer = v;                                                                        // 1
    }                                                                                                  // 1
}, 4);                                                                                                 // 1
var withStaticQuery = void 0;                                                                          // 1
module.watch(require("./lib/withStaticQuery"), {                                                       // 1
    "default": function (v) {                                                                          // 1
        withStaticQuery = v;                                                                           // 1
    }                                                                                                  // 1
}, 5);                                                                                                 // 1
var checkOptions = void 0;                                                                             // 1
module.watch(require("./lib/checkOptions"), {                                                          // 1
    "default": function (v) {                                                                          // 1
        checkOptions = v;                                                                              // 1
    }                                                                                                  // 1
}, 6);                                                                                                 // 1
module.exportDefault(function (handler) {                                                              // 1
    var _config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};              // 9
                                                                                                       //
    checkOptions(_config);                                                                             // 10
    var config = Object.assign({}, defaults, _config);                                                 // 11
    return function (component) {                                                                      // 13
        var queryContainer = withQueryContainer(component);                                            // 14
                                                                                                       //
        if (!config.reactive) {                                                                        // 16
            var staticQueryContainer = withStaticQuery(queryContainer);                                // 17
            return function (props) {                                                                  // 19
                var query = handler(props);                                                            // 20
                return React.createElement(staticQueryContainer, {                                     // 22
                    query: query,                                                                      // 23
                    props: props,                                                                      // 24
                    config: config                                                                     // 25
                });                                                                                    // 22
            };                                                                                         // 27
        } else {                                                                                       // 28
            return withReactiveQuery(handler, config, queryContainer);                                 // 29
        }                                                                                              // 30
    };                                                                                                 // 31
});                                                                                                    // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"legacy":{"createQueryContainer.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/legacy/createQueryContainer.js                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                //
                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                       //
                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");          //
                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                 //
                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                            //
                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                   //
                                                                                                       //
var _extends3 = require("babel-runtime/helpers/extends");                                              //
                                                                                                       //
var _extends4 = _interopRequireDefault(_extends3);                                                     //
                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }      //
                                                                                                       //
var React = void 0;                                                                                    // 1
module.watch(require("react"), {                                                                       // 1
    "default": function (v) {                                                                          // 1
        React = v;                                                                                     // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var createContainer = void 0;                                                                          // 1
module.watch(require("meteor/react-meteor-data"), {                                                    // 1
    createContainer: function (v) {                                                                    // 1
        createContainer = v;                                                                           // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
module.exportDefault(function (query, component) {                                                     // 1
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};              // 4
                                                                                                       //
    if (Meteor.isDevelopment) {                                                                        // 5
        console.warn('createQueryContainer() is deprecated, please use withQuery() instead');          // 6
    }                                                                                                  // 7
                                                                                                       //
    if (options.reactive) {                                                                            // 9
        return createContainer(function (props) {                                                      // 10
            var _extends2;                                                                             // 10
                                                                                                       //
            if (props.params) {                                                                        // 11
                query.setParams(props.params);                                                         // 12
            }                                                                                          // 13
                                                                                                       //
            var handler = query.subscribe();                                                           // 15
            return (0, _extends4.default)((_extends2 = {                                               // 17
                query: query,                                                                          // 18
                loading: !handler.ready()                                                              // 19
            }, _extends2[options.dataProp] = options.single ? _.first(query.fetch()) : query.fetch(), _extends2), props);
        }, component);                                                                                 // 23
    }                                                                                                  // 24
                                                                                                       //
    var MethodQueryComponent = function (_React$Component) {                                           // 4
        (0, _inherits3.default)(MethodQueryComponent, _React$Component);                               // 4
                                                                                                       //
        function MethodQueryComponent() {                                                              // 27
            var _this$state;                                                                           // 27
                                                                                                       //
            (0, _classCallCheck3.default)(this, MethodQueryComponent);                                 // 27
                                                                                                       //
            var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));   // 27
                                                                                                       //
            _this.state = (_this$state = {}, _this$state[options.dataProp] = undefined, _this$state.error = undefined, _this$state.loading = true, _this$state);
            return _this;                                                                              // 27
        }                                                                                              // 34
                                                                                                       //
        MethodQueryComponent.prototype.componentWillReceiveProps = function () {                       // 4
            function componentWillReceiveProps(nextProps) {                                            // 4
                this._fetch(nextProps.params);                                                         // 37
            }                                                                                          // 38
                                                                                                       //
            return componentWillReceiveProps;                                                          // 4
        }();                                                                                           // 4
                                                                                                       //
        MethodQueryComponent.prototype.componentDidMount = function () {                               // 4
            function componentDidMount() {                                                             // 4
                this._fetch(this.props.params);                                                        // 41
            }                                                                                          // 42
                                                                                                       //
            return componentDidMount;                                                                  // 4
        }();                                                                                           // 4
                                                                                                       //
        MethodQueryComponent.prototype._fetch = function () {                                          // 4
            function _fetch(params) {                                                                  // 4
                var _this2 = this;                                                                     // 44
                                                                                                       //
                if (params) {                                                                          // 45
                    query.setParams(params);                                                           // 46
                }                                                                                      // 47
                                                                                                       //
                query.fetch(function (error, data) {                                                   // 49
                    var _state;                                                                        // 49
                                                                                                       //
                    var state = (_state = {                                                            // 50
                        error: error                                                                   // 51
                    }, _state[options.dataProp] = options.single ? _.first(data) : data, _state.loading = false, _state);
                                                                                                       //
                    _this2.setState(state);                                                            // 56
                });                                                                                    // 57
            }                                                                                          // 58
                                                                                                       //
            return _fetch;                                                                             // 4
        }();                                                                                           // 4
                                                                                                       //
        MethodQueryComponent.prototype.render = function () {                                          // 4
            function render() {                                                                        // 4
                var state = this.state,                                                                // 60
                    props = this.props;                                                                // 60
                return React.createElement(component, (0, _extends4.default)({                         // 63
                    query: query                                                                       // 64
                }, state, props));                                                                     // 63
            }                                                                                          // 68
                                                                                                       //
            return render;                                                                             // 4
        }();                                                                                           // 4
                                                                                                       //
        return MethodQueryComponent;                                                                   // 4
    }(React.Component);                                                                                // 4
                                                                                                       //
    MethodQueryComponent.propTypes = {                                                                 // 71
        params: React.PropTypes.object                                                                 // 72
    };                                                                                                 // 71
    return MethodQueryComponent;                                                                       // 75
});                                                                                                    // 76
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"checkOptions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/lib/checkOptions.js                                             //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var React = void 0;                                                                                    // 1
module.watch(require("react"), {                                                                       // 1
    "default": function (v) {                                                                          // 1
        React = v;                                                                                     // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var check = void 0,                                                                                    // 1
    Match = void 0;                                                                                    // 1
module.watch(require("meteor/check"), {                                                                // 1
    check: function (v) {                                                                              // 1
        check = v;                                                                                     // 1
    },                                                                                                 // 1
    Match: function (v) {                                                                              // 1
        Match = v;                                                                                     // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
module.exportDefault(function (options) {                                                              // 1
    check(options, {                                                                                   // 5
        reactive: Match.Maybe(Boolean),                                                                // 6
        single: Match.Maybe(Boolean),                                                                  // 7
        pollingMs: Match.Maybe(Number),                                                                // 8
        errorComponent: Match.Maybe(React.Component),                                                  // 9
        loadingComponent: Match.Maybe(React.Component)                                                 // 10
    });                                                                                                // 5
                                                                                                       //
    if (options.reactive && options.poll) {                                                            // 13
        throw new Meteor.Error("You cannot have a query that is reactive and it is with polling");     // 14
    }                                                                                                  // 15
});                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDisplayName.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/lib/getDisplayName.js                                           //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
module.export({                                                                                        // 1
    "default": function () {                                                                           // 1
        return getDisplayName;                                                                         // 1
    }                                                                                                  // 1
});                                                                                                    // 1
                                                                                                       //
function getDisplayName(WrappedComponent) {                                                            // 1
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';                       // 2
}                                                                                                      // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQueryContainer.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/lib/withQueryContainer.js                                       //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                              //
                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                     //
                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }      //
                                                                                                       //
module.export({                                                                                        // 1
    "default": function () {                                                                           // 1
        return withQueryContainer;                                                                     // 1
    }                                                                                                  // 1
});                                                                                                    // 1
var React = void 0;                                                                                    // 1
module.watch(require("react"), {                                                                       // 1
    "default": function (v) {                                                                          // 1
        React = v;                                                                                     // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var PropTypes = void 0;                                                                                // 1
module.watch(require("prop-types"), {                                                                  // 1
    "default": function (v) {                                                                          // 1
        PropTypes = v;                                                                                 // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
var Query = void 0,                                                                                    // 1
    NamedQuery = void 0;                                                                               // 1
module.watch(require("meteor/cultofcoders:grapher-react"), {                                           // 1
    Query: function (v) {                                                                              // 1
        Query = v;                                                                                     // 1
    },                                                                                                 // 1
    NamedQuery: function (v) {                                                                         // 1
        NamedQuery = v;                                                                                // 1
    }                                                                                                  // 1
}, 2);                                                                                                 // 1
var getDisplayName = void 0;                                                                           // 1
module.watch(require("./getDisplayName"), {                                                            // 1
    "default": function (v) {                                                                          // 1
        getDisplayName = v;                                                                            // 1
    }                                                                                                  // 1
}, 3);                                                                                                 // 1
var withTracker = void 0;                                                                              // 1
module.watch(require("meteor/react-meteor-data"), {                                                    // 1
    withTracker: function (v) {                                                                        // 1
        withTracker = v;                                                                               // 1
    }                                                                                                  // 1
}, 4);                                                                                                 // 1
var propTypes = {                                                                                      // 7
    grapher: PropTypes.shape({                                                                         // 8
        isLoading: PropTypes.bool.isRequired,                                                          // 9
        error: PropTypes.object,                                                                       // 10
        data: PropTypes.array,                                                                         // 11
        query: PropTypes.oneOfType([PropTypes.instanceOf(Query), PropTypes.instanceOf(NamedQuery)])    // 12
    }).isRequired,                                                                                     // 8
    config: PropTypes.object.isRequired,                                                               // 17
    props: PropTypes.object                                                                            // 18
};                                                                                                     // 7
                                                                                                       //
function withQueryContainer(WrappedComponent) {                                                        // 21
    var GrapherQueryContainer = function (_ref) {                                                      // 22
        var grapher = _ref.grapher,                                                                    // 22
            config = _ref.config,                                                                      // 22
            query = _ref.query,                                                                        // 22
            props = _ref.props;                                                                        // 22
        var isLoading = grapher.isLoading,                                                             // 22
            error = grapher.error,                                                                     // 22
            data = grapher.data;                                                                       // 22
                                                                                                       //
        if (error && config.errorComponent) {                                                          // 25
            return React.createElement(config.errorComponent, {                                        // 26
                error: error,                                                                          // 27
                query: query                                                                           // 28
            });                                                                                        // 26
        }                                                                                              // 30
                                                                                                       //
        if (isLoading && config.loadingComponent) {                                                    // 32
            return React.createElement(config.loadingComponent, {                                      // 33
                query: query                                                                           // 34
            });                                                                                        // 33
        }                                                                                              // 36
                                                                                                       //
        return React.createElement(WrappedComponent, (0, _extends3.default)({}, props, {               // 38
            isLoading: error ? false : isLoading,                                                      // 40
            error: error,                                                                              // 41
            data: config.single ? data[0] : data,                                                      // 42
            query: query                                                                               // 43
        }));                                                                                           // 38
    };                                                                                                 // 45
                                                                                                       //
    GrapherQueryContainer.propTypes = propTypes;                                                       // 47
    GrapherQueryContainer.displayName = "GrapherQuery(" + getDisplayName(WrappedComponent) + ")";      // 48
    return GrapherQueryContainer;                                                                      // 50
}                                                                                                      // 51
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withReactiveQuery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/lib/withReactiveQuery.js                                        //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                              //
                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                     //
                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }      //
                                                                                                       //
module.export({                                                                                        // 1
    "default": function () {                                                                           // 1
        return withReactiveContainer;                                                                  // 1
    }                                                                                                  // 1
});                                                                                                    // 1
var withTracker = void 0;                                                                              // 1
module.watch(require("meteor/react-meteor-data"), {                                                    // 1
    withTracker: function (v) {                                                                        // 1
        withTracker = v;                                                                               // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var ReactiveVar = void 0;                                                                              // 1
module.watch(require("meteor/reactive-var"), {                                                         // 1
    ReactiveVar: function (v) {                                                                        // 1
        ReactiveVar = v;                                                                               // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
                                                                                                       //
function withReactiveContainer(handler, config, QueryComponent) {                                      // 11
    var subscriptionError = new ReactiveVar();                                                         // 12
    return withTracker(function (props) {                                                              // 14
        var query = handler(props);                                                                    // 15
        var subscriptionHandle = query.subscribe({                                                     // 17
            onStop: function (err) {                                                                   // 18
                if (err) {                                                                             // 19
                    subscriptionError.set(err);                                                        // 20
                }                                                                                      // 21
            },                                                                                         // 22
            onReady: function () {                                                                     // 23
                subscriptionError.set(null);                                                           // 24
            }                                                                                          // 25
        });                                                                                            // 17
        var isReady = subscriptionHandle.ready();                                                      // 28
        var data = query.fetch();                                                                      // 30
        return {                                                                                       // 32
            grapher: {                                                                                 // 33
                isLoading: !isReady,                                                                   // 34
                data: data,                                                                            // 35
                error: subscriptionError                                                               // 36
            },                                                                                         // 33
            query: query,                                                                              // 38
            config: config,                                                                            // 39
            props: props                                                                               // 40
        };                                                                                             // 32
    })(errorTracker(QueryComponent));                                                                  // 42
}                                                                                                      // 43
                                                                                                       //
var errorTracker = withTracker(function (props) {                                                      // 45
    var error = props.grapher.error.get();                                                             // 46
    return (0, _extends3.default)({}, props, {                                                         // 48
        grapher: (0, _extends3.default)({}, props.grapher, {                                           // 50
            error: error                                                                               // 52
        })                                                                                             // 50
    });                                                                                                // 48
});                                                                                                    // 55
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withStaticQuery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/cultofcoders_grapher-react/lib/withStaticQuery.js                                          //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                              //
                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                     //
                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                //
                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                       //
                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");          //
                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                 //
                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                            //
                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                   //
                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }      //
                                                                                                       //
module.export({                                                                                        // 1
    "default": function () {                                                                           // 1
        return withStaticQueryContainer;                                                               // 1
    }                                                                                                  // 1
});                                                                                                    // 1
var React = void 0;                                                                                    // 1
module.watch(require("react"), {                                                                       // 1
    "default": function (v) {                                                                          // 1
        React = v;                                                                                     // 1
    }                                                                                                  // 1
}, 0);                                                                                                 // 1
var getDisplayName = void 0;                                                                           // 1
module.watch(require("./getDisplayName"), {                                                            // 1
    "default": function (v) {                                                                          // 1
        getDisplayName = v;                                                                            // 1
    }                                                                                                  // 1
}, 1);                                                                                                 // 1
                                                                                                       //
function withStaticQueryContainer(WrappedComponent) {                                                  // 4
    /**                                                                                                // 5
     * We use it like this so we can have naming inside React Dev Tools                                //
     * This is a standard pattern in HOCs                                                              //
     */var GrapherStaticQueryContainer = function (_React$Component) {                                 //
        (0, _inherits3.default)(GrapherStaticQueryContainer, _React$Component);                        // 4
                                                                                                       //
        function GrapherStaticQueryContainer() {                                                       // 4
            var _temp, _this, _ret;                                                                    // 4
                                                                                                       //
            (0, _classCallCheck3.default)(this, GrapherStaticQueryContainer);                          // 4
                                                                                                       //
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {     // 4
                args[_key] = arguments[_key];                                                          // 4
            }                                                                                          // 4
                                                                                                       //
            return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
                isLoading: true,                                                                       // 11
                error: null,                                                                           // 12
                data: []                                                                               // 13
            }, _this.refetch = function () {                                                           // 10
                var query = _this.props.query;                                                         // 54
                                                                                                       //
                _this.fetch(query);                                                                    // 56
            }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);                          // 57
        }                                                                                              // 4
                                                                                                       //
        GrapherStaticQueryContainer.prototype.componentWillReceiveProps = function () {                // 4
            function componentWillReceiveProps(nextProps) {                                            // 4
                var query = nextProps.query;                                                           // 16
                this.fetch(query);                                                                     // 18
            }                                                                                          // 19
                                                                                                       //
            return componentWillReceiveProps;                                                          // 4
        }();                                                                                           // 4
                                                                                                       //
        GrapherStaticQueryContainer.prototype.componentDidMount = function () {                        // 4
            function componentDidMount() {                                                             // 4
                var _this2 = this;                                                                     // 21
                                                                                                       //
                var _props = this.props,                                                               // 21
                    query = _props.query,                                                              // 21
                    config = _props.config;                                                            // 21
                this.fetch(query);                                                                     // 23
                                                                                                       //
                if (config.pollingMs) {                                                                // 25
                    this.pollingInterval = setInterval(function () {                                   // 26
                        _this2.fetch(query);                                                           // 27
                    }, config.pollingMs);                                                              // 28
                }                                                                                      // 29
            }                                                                                          // 30
                                                                                                       //
            return componentDidMount;                                                                  // 4
        }();                                                                                           // 4
                                                                                                       //
        GrapherStaticQueryContainer.prototype.componentWillUnmount = function () {                     // 4
            function componentWillUnmount() {                                                          // 4
                this.pollingInterval && clearInterval(this.pollingInterval);                           // 33
            }                                                                                          // 34
                                                                                                       //
            return componentWillUnmount;                                                               // 4
        }();                                                                                           // 4
                                                                                                       //
        GrapherStaticQueryContainer.prototype.fetch = function () {                                    // 4
            function fetch(query) {                                                                    // 4
                var _this3 = this;                                                                     // 36
                                                                                                       //
                query.fetch(function (error, data) {                                                   // 37
                    if (error) {                                                                       // 38
                        _this3.setState({                                                              // 39
                            error: error,                                                              // 40
                            data: [],                                                                  // 41
                            isLoading: false                                                           // 42
                        });                                                                            // 39
                    } else {                                                                           // 44
                        _this3.setState({                                                              // 45
                            error: null,                                                               // 46
                            data: data,                                                                // 47
                            isLoading: false                                                           // 48
                        });                                                                            // 45
                    }                                                                                  // 50
                });                                                                                    // 51
            }                                                                                          // 52
                                                                                                       //
            return fetch;                                                                              // 4
        }();                                                                                           // 4
                                                                                                       //
        GrapherStaticQueryContainer.prototype.render = function () {                                   // 4
            function render() {                                                                        // 4
                var _props2 = this.props,                                                              // 59
                    config = _props2.config,                                                           // 59
                    props = _props2.props,                                                             // 59
                    query = _props2.query;                                                             // 59
                return React.createElement(WrappedComponent, {                                         // 62
                    grapher: this.state,                                                               // 63
                    config: config,                                                                    // 64
                    query: query,                                                                      // 65
                    props: (0, _extends3.default)({}, props, {                                         // 66
                        refetch: this.refetch                                                          // 66
                    })                                                                                 // 66
                });                                                                                    // 62
            }                                                                                          // 68
                                                                                                       //
            return render;                                                                             // 4
        }();                                                                                           // 4
                                                                                                       //
        return GrapherStaticQueryContainer;                                                            // 4
    }(React.Component);                                                                                // 4
                                                                                                       //
    GrapherStaticQueryContainer.displayName = "StaticQuery(" + getDisplayName(WrappedComponent) + ")";
    return GrapherStaticQueryContainer;                                                                // 73
}                                                                                                      // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
var exports = require("./node_modules/meteor/cultofcoders:grapher-react/main.client.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cultofcoders:grapher-react'] = exports;

})();
