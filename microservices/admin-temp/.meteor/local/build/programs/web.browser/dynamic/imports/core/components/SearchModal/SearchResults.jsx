function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/core/components/SearchModal/SearchResults.jsx                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";                                                                                                          //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _createClass2 = require("babel-runtime/helpers/createClass");                                                      //
                                                                                                                       //
var _createClass3 = _interopRequireDefault(_createClass2);                                                             //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var React = void 0,                                                                                                    // 1
    _Component = void 0;                                                                                               // 1
                                                                                                                       //
module.watch(require("react"), {                                                                                       // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      React = v;                                                                                                       // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }(),                                                                                                                 // 1
  Component: function () {                                                                                             // 1
    function Component(v) {                                                                                            // 1
      _Component = v;                                                                                                  // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return Component;                                                                                                  // 1
  }()                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      PropTypes = v;                                                                                                   // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var JsSearch = void 0;                                                                                                 // 1
module.watch(require("js-search"), {                                                                                   // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      JsSearch = v;                                                                                                    // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 2);                                                                                                                 // 1
                                                                                                                       //
var _injectIntl = void 0;                                                                                              // 1
                                                                                                                       //
module.watch(require("react-intl"), {                                                                                  // 1
  injectIntl: function () {                                                                                            // 1
    function injectIntl(v) {                                                                                           // 1
      _injectIntl = v;                                                                                                 // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return injectIntl;                                                                                                 // 1
  }()                                                                                                                  // 1
}, 3);                                                                                                                 // 1
                                                                                                                       //
var List = void 0,                                                                                                     // 1
    _ListItem = void 0,                                                                                                // 1
    _ListItemText = void 0;                                                                                            // 1
                                                                                                                       //
module.watch(require("material-ui/List"), {                                                                            // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      List = v;                                                                                                        // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }(),                                                                                                                 // 1
  ListItem: function () {                                                                                              // 1
    function ListItem(v) {                                                                                             // 1
      _ListItem = v;                                                                                                   // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return ListItem;                                                                                                   // 1
  }(),                                                                                                                 // 1
  ListItemText: function () {                                                                                          // 1
    function ListItemText(v) {                                                                                         // 1
      _ListItemText = v;                                                                                               // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return ListItemText;                                                                                               // 1
  }()                                                                                                                  // 1
}, 4);                                                                                                                 // 1
                                                                                                                       //
var _T = void 0;                                                                                                       // 1
                                                                                                                       //
module.watch(require("../Translation"), {                                                                              // 1
  T: function () {                                                                                                     // 1
    function T(v) {                                                                                                    // 1
      _T = v;                                                                                                          // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return T;                                                                                                          // 1
  }()                                                                                                                  // 1
}, 5);                                                                                                                 // 1
                                                                                                                       //
var _generalTooltips = void 0;                                                                                         // 1
                                                                                                                       //
module.watch(require("../../arrays/tooltips"), {                                                                       // 1
  generalTooltips: function () {                                                                                       // 1
    function generalTooltips(v) {                                                                                      // 1
      _generalTooltips = v;                                                                                            // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return generalTooltips;                                                                                            // 1
  }()                                                                                                                  // 1
}, 6);                                                                                                                 // 1
var Button = void 0;                                                                                                   // 1
module.watch(require("../Button"), {                                                                                   // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      Button = v;                                                                                                      // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 7);                                                                                                                 // 1
var styles = {                                                                                                         // 12
  list: {                                                                                                              // 13
    width: '100%',                                                                                                     // 14
    maxWidth: 800                                                                                                      // 15
  },                                                                                                                   // 13
  selected: {                                                                                                          // 17
    width: '100%',                                                                                                     // 18
    maxWidth: 800                                                                                                      // 19
  }                                                                                                                    // 17
};                                                                                                                     // 12
                                                                                                                       //
var SearchResults = function (_Component2) {                                                                           //
  (0, _inherits3.default)(SearchResults, _Component2);                                                                 //
                                                                                                                       //
  function SearchResults(props) {                                                                                      // 24
    (0, _classCallCheck3.default)(this, SearchResults);                                                                // 24
                                                                                                                       //
    var _this = (0, _possibleConstructorReturn3.default)(this, (SearchResults.__proto__ || Object.getPrototypeOf(SearchResults)).call(this, props));
                                                                                                                       //
    _this.setupSearch = function () {                                                                                  // 24
      _this.search = new JsSearch.Search('id');                                                                        // 39
                                                                                                                       //
      _this.search.addIndex('tooltipMatch');                                                                           // 40
                                                                                                                       //
      _this.search.addIndex('tooltipValue1');                                                                          // 41
                                                                                                                       //
      _this.search.addIndex('tooltipValue2');                                                                          // 42
                                                                                                                       //
      _this.search.addDocuments(_this.getTooltips());                                                                  // 43
    };                                                                                                                 // 44
                                                                                                                       //
    _this.getTooltips = function () {                                                                                  // 24
      var f = _this.props.intl.formatMessage;                                                                          // 47
      var intlValues = {                                                                                               // 48
        verticalSpace: ' '                                                                                             // 49
      };                                                                                                               // 48
      return Object.keys(_generalTooltips).map(function (match) {                                                      // 52
        var tooltipId = _generalTooltips[match];                                                                       // 53
        var tooltip = {                                                                                                // 54
          id: tooltipId,                                                                                               // 55
          tooltipMatch: match,                                                                                         // 56
          tooltipValue1: f({                                                                                           // 57
            id: "tooltip." + tooltipId                                                                                 // 57
          }, intlValues)                                                                                               // 57
        };                                                                                                             // 54
                                                                                                                       //
        if (typeof _generalTooltips[match] !== 'string') {                                                             // 59
          tooltip.tooltipValue2 = f({                                                                                  // 60
            id: "tooltip2." + tooltipId                                                                                // 60
          }, intlValues);                                                                                              // 60
        }                                                                                                              // 61
                                                                                                                       //
        return tooltip;                                                                                                // 63
      });                                                                                                              // 64
    };                                                                                                                 // 65
                                                                                                                       //
    _this.state = {                                                                                                    // 27
      showId: ''                                                                                                       // 27
    };                                                                                                                 // 27
                                                                                                                       //
    _this.setupSearch();                                                                                               // 28
                                                                                                                       //
    return _this;                                                                                                      // 24
  }                                                                                                                    // 29
                                                                                                                       //
  (0, _createClass3.default)(SearchResults, [{                                                                         //
    key: "componentWillReceiveProps",                                                                                  //
    value: function () {                                                                                               //
      function componentWillReceiveProps(nextProps) {                                                                  //
        // Cancel viewing results if something new is typed/deleted                                                    // 32
        if (nextProps.search !== this.props.search && this.state.showId) {                                             // 33
          this.setState({                                                                                              // 34
            showId: ''                                                                                                 // 34
          });                                                                                                          // 34
        }                                                                                                              // 35
      }                                                                                                                // 36
                                                                                                                       //
      return componentWillReceiveProps;                                                                                //
    }()                                                                                                                //
  }, {                                                                                                                 //
    key: "render",                                                                                                     //
    value: function () {                                                                                               //
      function render() {                                                                                              //
        var _this2 = this;                                                                                             // 67
                                                                                                                       //
        var search = this.props.search;                                                                                // 67
        var showId = this.state.showId;                                                                                // 67
        var results = this.search.search(search);                                                                      // 70
                                                                                                                       //
        if (search && results.length === 0) {                                                                          // 72
          return React.createElement(                                                                                  // 73
            "div",                                                                                                     // 74
            {                                                                                                          // 74
              className: "description"                                                                                 // 74
            },                                                                                                         // 74
            React.createElement(                                                                                       // 75
              "p",                                                                                                     // 75
              null,                                                                                                    // 75
              React.createElement(_T, {                                                                                // 76
                id: "SearchResults.none"                                                                               // 76
              })                                                                                                       // 76
            )                                                                                                          // 75
          );                                                                                                           // 74
        }                                                                                                              // 80
                                                                                                                       //
        if (showId) {                                                                                                  // 82
          var selectedResult = results.filter(function (result) {                                                      // 83
            return result.id === showId;                                                                               // 83
          })[0];                                                                                                       // 83
          return React.createElement(                                                                                  // 84
            "div",                                                                                                     // 85
            {                                                                                                          // 85
              className: "flex-col",                                                                                   // 85
              style: styles.selected                                                                                   // 85
            },                                                                                                         // 85
            React.createElement(                                                                                       // 86
              "h3",                                                                                                    // 86
              null,                                                                                                    // 86
              selectedResult.tooltipMatch                                                                              // 86
            ),                                                                                                         // 86
            React.createElement(                                                                                       // 87
              "p",                                                                                                     // 87
              null,                                                                                                    // 87
              selectedResult.tooltipValue1                                                                             // 87
            ),                                                                                                         // 87
            React.createElement("br", null),                                                                           // 88
            React.createElement(                                                                                       // 89
              "p",                                                                                                     // 89
              null,                                                                                                    // 89
              selectedResult.tooltipValue2                                                                             // 89
            ),                                                                                                         // 89
            React.createElement(                                                                                       // 90
              "div",                                                                                                   // 90
              {                                                                                                        // 90
                className: "text-center",                                                                              // 90
                style: {                                                                                               // 90
                  paddingTop: 16                                                                                       // 90
                }                                                                                                      // 90
              },                                                                                                       // 90
              React.createElement(Button, {                                                                            // 91
                primary: true,                                                                                         // 92
                label: React.createElement(_T, {                                                                       // 93
                  id: "general.ok"                                                                                     // 93
                }),                                                                                                    // 93
                onClick: function () {                                                                                 // 94
                  function onClick() {                                                                                 // 94
                    return _this2.setState({                                                                           // 94
                      showId: ''                                                                                       // 94
                    });                                                                                                // 94
                  }                                                                                                    // 94
                                                                                                                       //
                  return onClick;                                                                                      // 94
                }()                                                                                                    // 94
              })                                                                                                       // 91
            )                                                                                                          // 90
          );                                                                                                           // 85
        }                                                                                                              // 99
                                                                                                                       //
        return React.createElement(                                                                                    // 101
          List,                                                                                                        // 102
          {                                                                                                            // 102
            style: styles.list                                                                                         // 102
          },                                                                                                           // 102
          results.slice(0, 5).map(function (result) {                                                                  // 103
            return React.createElement(                                                                                // 103
              _ListItem,                                                                                               // 104
              {                                                                                                        // 104
                button: true,                                                                                          // 105
                divider: true,                                                                                         // 106
                onClick: function () {                                                                                 // 107
                  function onClick() {                                                                                 // 107
                    return _this2.setState({                                                                           // 107
                      showId: result.id                                                                                // 107
                    });                                                                                                // 107
                  }                                                                                                    // 107
                                                                                                                       //
                  return onClick;                                                                                      // 107
                }(),                                                                                                   // 107
                key: result.id                                                                                         // 108
              },                                                                                                       // 104
              React.createElement(_ListItemText, {                                                                     // 110
                primary: result.tooltipMatch,                                                                          // 111
                secondary: result.tooltipValue1                                                                        // 112
              })                                                                                                       // 110
            );                                                                                                         // 104
          })                                                                                                           // 103
        );                                                                                                             // 102
      }                                                                                                                // 118
                                                                                                                       //
      return render;                                                                                                   //
    }()                                                                                                                //
  }]);                                                                                                                 //
  return SearchResults;                                                                                                //
}(_Component);                                                                                                         //
                                                                                                                       //
SearchResults.propTypes = {                                                                                            // 121
  search: PropTypes.string.isRequired,                                                                                 // 122
  intl: PropTypes.object.isRequired                                                                                    // 123
};                                                                                                                     // 121
module.exportDefault(_injectIntl(SearchResults));                                                                      // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
//# sourceMappingURL=/dynamic/imports/core/components/SearchModal/e21c7642f367278d483a60ea024f01c9104c4c8d.map
