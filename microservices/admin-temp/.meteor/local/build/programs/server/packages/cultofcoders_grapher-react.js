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

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/main.server.js                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.watch(require("./setDefaults.js"), {
    default(v) {
        exports.setDefaults = v;
    }

}, 1);
module.watch(require("./withQuery.js"), {
    default(v) {
        exports.withQuery = v;
    }

}, 2);
module.watch(require("./legacy/createQueryContainer.js"), {
    default(v) {
        exports.createQueryContainer = v;
    }

}, 3);
let checkNpmVersions;
module.watch(require("meteor/tmeasday:check-npm-versions"), {
    checkNpmVersions(v) {
        checkNpmVersions = v;
    }

}, 0);
checkNpmVersions({
    react: '15.3 - 16',
    'prop-types': '15.0 - 16'
}, 'cultofcoders:grapher-react');
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/defaults.js                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.exportDefault({
    reactive: false,
    single: false
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDefaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/setDefaults.js                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({
    default: () => setDefaults
});
let defaults;
module.watch(require("./defaults"), {
    default(v) {
        defaults = v;
    }

}, 0);

function setDefaults(newDefaults) {
    Object.assign(defaults, newDefaults);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/withQuery.js                                                 //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let React;
module.watch(require("react"), {
    default(v) {
        React = v;
    }

}, 0);
let defaults;
module.watch(require("./defaults"), {
    default(v) {
        defaults = v;
    }

}, 1);
let withTracker;
module.watch(require("meteor/react-meteor-data"), {
    withTracker(v) {
        withTracker = v;
    }

}, 2);
let withReactiveQuery;
module.watch(require("./lib/withReactiveQuery"), {
    default(v) {
        withReactiveQuery = v;
    }

}, 3);
let withQueryContainer;
module.watch(require("./lib/withQueryContainer"), {
    default(v) {
        withQueryContainer = v;
    }

}, 4);
let withStaticQuery;
module.watch(require("./lib/withStaticQuery"), {
    default(v) {
        withStaticQuery = v;
    }

}, 5);
let checkOptions;
module.watch(require("./lib/checkOptions"), {
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
            const staticQueryContainer = withStaticQuery(queryContainer);
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
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"legacy":{"createQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/legacy/createQueryContainer.js                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let React;
module.watch(require("react"), {
    default(v) {
        React = v;
    }

}, 0);
let createContainer;
module.watch(require("meteor/react-meteor-data"), {
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
            return (0, _extends3.default)({
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
            return React.createElement(component, (0, _extends3.default)({
                query
            }, state, props));
        }

    }

    MethodQueryComponent.propTypes = {
        params: React.PropTypes.object
    };
    return MethodQueryComponent;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"checkOptions.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/lib/checkOptions.js                                          //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let React;
module.watch(require("react"), {
    default(v) {
        React = v;
    }

}, 0);
let check, Match;
module.watch(require("meteor/check"), {
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
        errorComponent: Match.Maybe(React.Component),
        loadingComponent: Match.Maybe(React.Component)
    });

    if (options.reactive && options.poll) {
        throw new Meteor.Error(`You cannot have a query that is reactive and it is with polling`);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDisplayName.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/lib/getDisplayName.js                                        //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({
    default: () => getDisplayName
});

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"withQueryContainer.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/lib/withQueryContainer.js                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => withQueryContainer
});
let React;
module.watch(require("react"), {
    default(v) {
        React = v;
    }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
    default(v) {
        PropTypes = v;
    }

}, 1);
let Query, NamedQuery;
module.watch(require("meteor/cultofcoders:grapher-react"), {
    Query(v) {
        Query = v;
    },

    NamedQuery(v) {
        NamedQuery = v;
    }

}, 2);
let getDisplayName;
module.watch(require("./getDisplayName"), {
    default(v) {
        getDisplayName = v;
    }

}, 3);
let withTracker;
module.watch(require("meteor/react-meteor-data"), {
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

        return React.createElement(WrappedComponent, (0, _extends3.default)({}, props, {
            isLoading: error ? false : isLoading,
            error,
            data: config.single ? data[0] : data,
            query
        }));
    };

    GrapherQueryContainer.propTypes = propTypes;
    GrapherQueryContainer.displayName = `GrapherQuery(${getDisplayName(WrappedComponent)})`;
    return GrapherQueryContainer;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"withReactiveQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/lib/withReactiveQuery.js                                     //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => withReactiveContainer
});
let withTracker;
module.watch(require("meteor/react-meteor-data"), {
    withTracker(v) {
        withTracker = v;
    }

}, 0);
let ReactiveVar;
module.watch(require("meteor/reactive-var"), {
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
    return (0, _extends3.default)({}, props, {
        grapher: (0, _extends3.default)({}, props.grapher, {
            error
        })
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"withStaticQuery.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cultofcoders_grapher-react/lib/withStaticQuery.js                                       //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => withStaticQueryContainer
});
let React;
module.watch(require("react"), {
    default(v) {
        React = v;
    }

}, 0);
let getDisplayName;
module.watch(require("./getDisplayName"), {
    default(v) {
        getDisplayName = v;
    }

}, 1);

function withStaticQueryContainer(WrappedComponent) {
    /**
     * We use it like this so we can have naming inside React Dev Tools
     * This is a standard pattern in HOCs
     */class GrapherStaticQueryContainer extends React.Component {
        constructor(...args) {
            var _temp;

            return _temp = super(...args), this.state = {
                isLoading: true,
                error: null,
                data: []
            }, this.refetch = () => {
                const {
                    query
                } = this.props;
                this.fetch(query);
            }, _temp;
        }

        componentWillReceiveProps(nextProps) {
            const {
                query
            } = nextProps;
            this.fetch(query);
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
                props: (0, _extends3.default)({}, props, {
                    refetch: this.refetch
                })
            });
        }

    }

    GrapherStaticQueryContainer.displayName = `StaticQuery(${getDisplayName(WrappedComponent)})`;
    return GrapherStaticQueryContainer;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
var exports = require("./node_modules/meteor/cultofcoders:grapher-react/main.server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cultofcoders:grapher-react'] = exports;

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher-react.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2RlZmF1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9zZXREZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3Qvd2l0aFF1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9sZWdhY3kvY3JlYXRlUXVlcnlDb250YWluZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2xpYi9jaGVja09wdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyLXJlYWN0L2xpYi9nZXREaXNwbGF5TmFtZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbGliL3dpdGhRdWVyeUNvbnRhaW5lci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QvbGliL3dpdGhSZWFjdGl2ZVF1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdC9saWIvd2l0aFN0YXRpY1F1ZXJ5LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0cyIsInNldERlZmF1bHRzIiwid2l0aFF1ZXJ5IiwiY3JlYXRlUXVlcnlDb250YWluZXIiLCJjaGVja05wbVZlcnNpb25zIiwicmVhY3QiLCJleHBvcnREZWZhdWx0IiwicmVhY3RpdmUiLCJzaW5nbGUiLCJleHBvcnQiLCJkZWZhdWx0cyIsIm5ld0RlZmF1bHRzIiwiT2JqZWN0IiwiYXNzaWduIiwiUmVhY3QiLCJ3aXRoVHJhY2tlciIsIndpdGhSZWFjdGl2ZVF1ZXJ5Iiwid2l0aFF1ZXJ5Q29udGFpbmVyIiwid2l0aFN0YXRpY1F1ZXJ5IiwiY2hlY2tPcHRpb25zIiwiaGFuZGxlciIsIl9jb25maWciLCJjb25maWciLCJjb21wb25lbnQiLCJxdWVyeUNvbnRhaW5lciIsInN0YXRpY1F1ZXJ5Q29udGFpbmVyIiwicHJvcHMiLCJxdWVyeSIsImNyZWF0ZUVsZW1lbnQiLCJjcmVhdGVDb250YWluZXIiLCJvcHRpb25zIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyYW1zIiwic2V0UGFyYW1zIiwic3Vic2NyaWJlIiwibG9hZGluZyIsInJlYWR5IiwiZGF0YVByb3AiLCJfIiwiZmlyc3QiLCJmZXRjaCIsIk1ldGhvZFF1ZXJ5Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJzdGF0ZSIsInVuZGVmaW5lZCIsImVycm9yIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIl9mZXRjaCIsImNvbXBvbmVudERpZE1vdW50IiwiZGF0YSIsInNldFN0YXRlIiwicmVuZGVyIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiY2hlY2siLCJNYXRjaCIsIk1heWJlIiwiQm9vbGVhbiIsInBvbGxpbmdNcyIsIk51bWJlciIsImVycm9yQ29tcG9uZW50IiwibG9hZGluZ0NvbXBvbmVudCIsInBvbGwiLCJFcnJvciIsImdldERpc3BsYXlOYW1lIiwiV3JhcHBlZENvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwibmFtZSIsIlF1ZXJ5IiwiTmFtZWRRdWVyeSIsImdyYXBoZXIiLCJzaGFwZSIsImlzTG9hZGluZyIsImJvb2wiLCJpc1JlcXVpcmVkIiwiYXJyYXkiLCJvbmVPZlR5cGUiLCJpbnN0YW5jZU9mIiwiR3JhcGhlclF1ZXJ5Q29udGFpbmVyIiwid2l0aFJlYWN0aXZlQ29udGFpbmVyIiwiUmVhY3RpdmVWYXIiLCJRdWVyeUNvbXBvbmVudCIsInN1YnNjcmlwdGlvbkVycm9yIiwic3Vic2NyaXB0aW9uSGFuZGxlIiwib25TdG9wIiwiZXJyIiwic2V0Iiwib25SZWFkeSIsImlzUmVhZHkiLCJlcnJvclRyYWNrZXIiLCJnZXQiLCJ3aXRoU3RhdGljUXVlcnlDb250YWluZXIiLCJHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXIiLCJyZWZldGNoIiwicG9sbGluZ0ludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImNsZWFySW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGtCQUFSLENBQWIsRUFBeUM7QUFBQ0MsWUFBUUMsQ0FBUixFQUFVO0FBQUNDLGdCQUFRQyxXQUFSLEdBQW9CRixDQUFwQjtBQUFzQjs7QUFBbEMsQ0FBekMsRUFBNkUsQ0FBN0U7QUFBZ0ZKLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxnQkFBUixDQUFiLEVBQXVDO0FBQUNDLFlBQVFDLENBQVIsRUFBVTtBQUFDQyxnQkFBUUUsU0FBUixHQUFrQkgsQ0FBbEI7QUFBb0I7O0FBQWhDLENBQXZDLEVBQXlFLENBQXpFO0FBQTRFSixPQUFPQyxLQUFQLENBQWFDLFFBQVEsa0NBQVIsQ0FBYixFQUF5RDtBQUFDQyxZQUFRQyxDQUFSLEVBQVU7QUFBQ0MsZ0JBQVFHLG9CQUFSLEdBQTZCSixDQUE3QjtBQUErQjs7QUFBM0MsQ0FBekQsRUFBc0csQ0FBdEc7QUFBeUcsSUFBSUssZ0JBQUo7QUFBcUJULE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxvQ0FBUixDQUFiLEVBQTJEO0FBQUNPLHFCQUFpQkwsQ0FBakIsRUFBbUI7QUFBQ0ssMkJBQWlCTCxDQUFqQjtBQUFtQjs7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LGlCQUFTO0FBQ0wsa0JBQU07QUFBQ2xDLHNCQUFEO0FBQVNJLHFCQUFUO0FBQWdCQztBQUFoQixnQkFBeUIsS0FBS0QsS0FBcEM7QUFFQSxtQkFBT1osTUFBTWMsYUFBTixDQUFvQjJDLGdCQUFwQixFQUFzQztBQUN6Q0sseUJBQVMsS0FBSzdCLEtBRDJCO0FBRXpDekIsc0JBRnlDO0FBR3pDSyxxQkFIeUM7QUFJekNELGtEQUFXQSxLQUFYO0FBQWtCeUUsNkJBQVMsS0FBS0E7QUFBaEM7QUFKeUMsYUFBdEMsQ0FBUDtBQU1IOztBQTNEcUQ7O0FBOEQxREQsZ0NBQTRCMUIsV0FBNUIsR0FBMkMsZUFBY0YsZUFBZUMsZ0JBQWYsQ0FBaUMsR0FBMUY7QUFFQSxXQUFPMkIsMkJBQVA7QUFDSCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9jdWx0b2Zjb2RlcnNfZ3JhcGhlci1yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcblxuY2hlY2tOcG1WZXJzaW9ucyh7XG4gICAgcmVhY3Q6ICcxNS4zIC0gMTYnLFxuICAgICdwcm9wLXR5cGVzJzogJzE1LjAgLSAxNicsXG59LCAnY3VsdG9mY29kZXJzOmdyYXBoZXItcmVhY3QnKTtcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIHNldERlZmF1bHRzXG59IGZyb20gJy4vc2V0RGVmYXVsdHMuanMnO1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgd2l0aFF1ZXJ5XG59IGZyb20gJy4vd2l0aFF1ZXJ5LmpzJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIGNyZWF0ZVF1ZXJ5Q29udGFpbmVyXG59IGZyb20gJy4vbGVnYWN5L2NyZWF0ZVF1ZXJ5Q29udGFpbmVyLmpzJzsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVhY3RpdmU6IGZhbHNlLFxuICAgIHNpbmdsZTogZmFsc2UsXG59IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXREZWZhdWx0cyhuZXdEZWZhdWx0cykge1xuICAgIE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG5ld0RlZmF1bHRzKTtcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuaW1wb3J0IHt3aXRoVHJhY2tlcn0gZnJvbSAnbWV0ZW9yL3JlYWN0LW1ldGVvci1kYXRhJztcbmltcG9ydCB3aXRoUmVhY3RpdmVRdWVyeSBmcm9tICcuL2xpYi93aXRoUmVhY3RpdmVRdWVyeSc7XG5pbXBvcnQgd2l0aFF1ZXJ5Q29udGFpbmVyIGZyb20gJy4vbGliL3dpdGhRdWVyeUNvbnRhaW5lcic7XG5pbXBvcnQgd2l0aFN0YXRpY1F1ZXJ5IGZyb20gJy4vbGliL3dpdGhTdGF0aWNRdWVyeSc7XG5pbXBvcnQgY2hlY2tPcHRpb25zIGZyb20gJy4vbGliL2NoZWNrT3B0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChoYW5kbGVyLCBfY29uZmlnID0ge30pIHtcbiAgICBjaGVja09wdGlvbnMoX2NvbmZpZyk7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIF9jb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgcXVlcnlDb250YWluZXIgPSB3aXRoUXVlcnlDb250YWluZXIoY29tcG9uZW50KTtcblxuICAgICAgICBpZiAoIWNvbmZpZy5yZWFjdGl2ZSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljUXVlcnlDb250YWluZXIgPSB3aXRoU3RhdGljUXVlcnkocXVlcnlDb250YWluZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBoYW5kbGVyKHByb3BzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHN0YXRpY1F1ZXJ5Q29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3aXRoUmVhY3RpdmVRdWVyeShoYW5kbGVyLCBjb25maWcsIHF1ZXJ5Q29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH07XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlQ29udGFpbmVyfSBmcm9tICdtZXRlb3IvcmVhY3QtbWV0ZW9yLWRhdGEnO1xuXG5leHBvcnQgZGVmYXVsdCAocXVlcnksIGNvbXBvbmVudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgICAgIGNvbnNvbGUud2FybignY3JlYXRlUXVlcnlDb250YWluZXIoKSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHdpdGhRdWVyeSgpIGluc3RlYWQnKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlYWN0aXZlKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVDb250YWluZXIoKHByb3BzKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvcHMucGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuc2V0UGFyYW1zKHByb3BzLnBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBxdWVyeS5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICBsb2FkaW5nOiAhaGFuZGxlci5yZWFkeSgpLFxuICAgICAgICAgICAgICAgIFtvcHRpb25zLmRhdGFQcm9wXTogb3B0aW9ucy5zaW5nbGUgPyBfLmZpcnN0KHF1ZXJ5LmZldGNoKCkpIDogcXVlcnkuZmV0Y2goKSxcbiAgICAgICAgICAgICAgICAuLi5wcm9wc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBjb21wb25lbnQpO1xuICAgIH1cblxuICAgIGNsYXNzIE1ldGhvZFF1ZXJ5Q29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBbb3B0aW9ucy5kYXRhUHJvcF06IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICB0aGlzLl9mZXRjaChuZXh0UHJvcHMucGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5fZmV0Y2godGhpcy5wcm9wcy5wYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2ZldGNoKHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LnNldFBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBxdWVyeS5mZXRjaCgoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIFtvcHRpb25zLmRhdGFQcm9wXTogb3B0aW9ucy5zaW5nbGUgPyBfLmZpcnN0KGRhdGEpIDogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGNvbnN0IHtzdGF0ZSwgcHJvcHN9ID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgLi4ucHJvcHNcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNZXRob2RRdWVyeUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgICAgIHBhcmFtczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuICAgIH07XG5cbiAgICByZXR1cm4gTWV0aG9kUXVlcnlDb21wb25lbnQ7XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y2hlY2ssIE1hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGNoZWNrKG9wdGlvbnMsIHtcbiAgICAgICAgcmVhY3RpdmU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgICAgICBzaW5nbGU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgICAgICBwb2xsaW5nTXM6IE1hdGNoLk1heWJlKE51bWJlciksXG4gICAgICAgIGVycm9yQ29tcG9uZW50OiBNYXRjaC5NYXliZShSZWFjdC5Db21wb25lbnQpLFxuICAgICAgICBsb2FkaW5nQ29tcG9uZW50OiBNYXRjaC5NYXliZShSZWFjdC5Db21wb25lbnQpLFxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMucmVhY3RpdmUgJiYgb3B0aW9ucy5wb2xsKSB7XG4gICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgWW91IGNhbm5vdCBoYXZlIGEgcXVlcnkgdGhhdCBpcyByZWFjdGl2ZSBhbmQgaXQgaXMgd2l0aCBwb2xsaW5nYClcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIHJldHVybiBXcmFwcGVkQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IFdyYXBwZWRDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50Jztcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7UXVlcnksIE5hbWVkUXVlcnl9IGZyb20gJ21ldGVvci9jdWx0b2Zjb2RlcnM6Z3JhcGhlci1yZWFjdCc7XG5pbXBvcnQgZ2V0RGlzcGxheU5hbWUgZnJvbSAnLi9nZXREaXNwbGF5TmFtZSc7XG5pbXBvcnQge3dpdGhUcmFja2VyfSBmcm9tICdtZXRlb3IvcmVhY3QtbWV0ZW9yLWRhdGEnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gICAgZ3JhcGhlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgICBlcnJvcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgZGF0YTogUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBxdWVyeTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihRdWVyeSksXG4gICAgICAgICAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihOYW1lZFF1ZXJ5KSxcbiAgICAgICAgXSlcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb3BzOiBQcm9wVHlwZXMub2JqZWN0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2l0aFF1ZXJ5Q29udGFpbmVyKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgICBsZXQgR3JhcGhlclF1ZXJ5Q29udGFpbmVyID0gZnVuY3Rpb24oe2dyYXBoZXIsIGNvbmZpZywgcXVlcnksIHByb3BzfSkge1xuICAgICAgICBjb25zdCB7aXNMb2FkaW5nLCBlcnJvciwgZGF0YX0gPSBncmFwaGVyO1xuXG4gICAgICAgIGlmIChlcnJvciAmJiBjb25maWcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbmZpZy5lcnJvckNvbXBvbmVudCwge1xuICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0xvYWRpbmcgJiYgY29uZmlnLmxvYWRpbmdDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbmZpZy5sb2FkaW5nQ29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlZENvbXBvbmVudCwge1xuICAgICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgICAgICBpc0xvYWRpbmc6IGVycm9yID8gZmFsc2UgOiBpc0xvYWRpbmcsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGRhdGE6IGNvbmZpZy5zaW5nbGUgPyBkYXRhWzBdIDogZGF0YSxcbiAgICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIEdyYXBoZXJRdWVyeUNvbnRhaW5lci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4gICAgR3JhcGhlclF1ZXJ5Q29udGFpbmVyLmRpc3BsYXlOYW1lID0gYEdyYXBoZXJRdWVyeSgke2dldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpfSlgO1xuXG4gICAgcmV0dXJuIEdyYXBoZXJRdWVyeUNvbnRhaW5lcjtcbn1cbiIsImltcG9ydCB7d2l0aFRyYWNrZXJ9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5pbXBvcnQge1JlYWN0aXZlVmFyfSBmcm9tICdtZXRlb3IvcmVhY3RpdmUtdmFyJztcblxuLyoqXG4gKiBXcmFwcyB0aGUgcXVlcnkgYW5kIHByb3ZpZGVzIHJlYWN0aXZlIGRhdGEgZmV0Y2hpbmcgdXRpbGl0eVxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcGFyYW0gUXVlcnlDb21wb25lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2l0aFJlYWN0aXZlQ29udGFpbmVyKGhhbmRsZXIsIGNvbmZpZywgUXVlcnlDb21wb25lbnQpIHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uRXJyb3IgPSBuZXcgUmVhY3RpdmVWYXIoKTtcblxuICAgIHJldHVybiB3aXRoVHJhY2tlcigocHJvcHMpID0+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBoYW5kbGVyKHByb3BzKTtcblxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25IYW5kbGUgPSBxdWVyeS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgb25TdG9wKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRXJyb3Iuc2V0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uUmVhZHkoKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRXJyb3Iuc2V0KG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBpc1JlYWR5ID0gc3Vic2NyaXB0aW9uSGFuZGxlLnJlYWR5KCk7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHF1ZXJ5LmZldGNoKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdyYXBoZXI6IHtcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc6ICFpc1JlYWR5LFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHN1YnNjcmlwdGlvbkVycm9yLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgIH1cbiAgICB9KShlcnJvclRyYWNrZXIoUXVlcnlDb21wb25lbnQpKVxufVxuXG5jb25zdCBlcnJvclRyYWNrZXIgPSB3aXRoVHJhY2tlcigocHJvcHMpID0+IHtcbiAgICBjb25zdCBlcnJvciA9IHByb3BzLmdyYXBoZXIuZXJyb3IuZ2V0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgZ3JhcGhlcjoge1xuICAgICAgICAgICAgLi4ucHJvcHMuZ3JhcGhlcixcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2V0RGlzcGxheU5hbWUgZnJvbSAnLi9nZXREaXNwbGF5TmFtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdpdGhTdGF0aWNRdWVyeUNvbnRhaW5lcihXcmFwcGVkQ29tcG9uZW50KSB7XG4gICAgLyoqXG4gICAgICogV2UgdXNlIGl0IGxpa2UgdGhpcyBzbyB3ZSBjYW4gaGF2ZSBuYW1pbmcgaW5zaWRlIFJlYWN0IERldiBUb29sc1xuICAgICAqIFRoaXMgaXMgYSBzdGFuZGFyZCBwYXR0ZXJuIGluIEhPQ3NcbiAgICAgKi9cbiAgICBjbGFzcyBHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHtxdWVyeX0gPSBuZXh0UHJvcHM7XG4gICAgICAgICAgICB0aGlzLmZldGNoKHF1ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgY29uc3Qge3F1ZXJ5LCBjb25maWd9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIHRoaXMuZmV0Y2gocXVlcnkpO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLnBvbGxpbmdNcykge1xuICAgICAgICAgICAgICAgIHRoaXMucG9sbGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICB9LCBjb25maWcucG9sbGluZ01zKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLnBvbGxpbmdJbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMucG9sbGluZ0ludGVydmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoKHF1ZXJ5KSB7XG4gICAgICAgICAgICBxdWVyeS5mZXRjaCgoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVmZXRjaCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtxdWVyeX0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgdGhpcy5mZXRjaChxdWVyeSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3Qge2NvbmZpZywgcHJvcHMsIHF1ZXJ5fSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdyYXBwZWRDb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICBncmFwaGVyOiB0aGlzLnN0YXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICBwcm9wczogey4uLnByb3BzLCByZWZldGNoOiB0aGlzLnJlZmV0Y2h9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXIuZGlzcGxheU5hbWUgPSBgU3RhdGljUXVlcnkoJHtnZXREaXNwbGF5TmFtZShXcmFwcGVkQ29tcG9uZW50KX0pYDtcblxuICAgIHJldHVybiBHcmFwaGVyU3RhdGljUXVlcnlDb250YWluZXI7XG59Il19
