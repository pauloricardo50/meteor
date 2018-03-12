function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/core/components/DateInput/DatePicker.jsx                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";                                                                                                          //
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");                              //
                                                                                                                       //
var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);                                     //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      React = v;                                                                                                       // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
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
var moment = void 0;                                                                                                   // 1
module.watch(require("moment"), {                                                                                      // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      moment = v;                                                                                                      // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var omit = void 0;                                                                                                     // 1
module.watch(require("lodash/omit"), {                                                                                 // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      omit = v;                                                                                                        // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 3);                                                                                                                 // 1
var SingleDatePicker = void 0;                                                                                         // 1
module.watch(require("react-dates/lib/components/SingleDatePicker"), {                                                 // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      SingleDatePicker = v;                                                                                            // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 4);                                                                                                                 // 1
var isInclusivelyAfterDay = void 0;                                                                                    // 1
module.watch(require("react-dates/lib/utils/isInclusivelyAfterDay"), {                                                 // 1
  "default": function () {                                                                                             // 1
    function _default(v) {                                                                                             // 1
      isInclusivelyAfterDay = v;                                                                                       // 1
    }                                                                                                                  // 1
                                                                                                                       //
    return _default;                                                                                                   // 1
  }()                                                                                                                  // 1
}, 5);                                                                                                                 // 1
                                                                                                                       //
// Given a min and/or max date, it blocks unavailable dates                                                            // 10
var setDateRange = function () {                                                                                       // 11
  function setDateRange() {                                                                                            // 11
    var minDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();                      // 11
    var maxDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;                       // 11
    return function (day) {                                                                                            // 11
      return minDate && !isInclusivelyAfterDay(day, moment(minDate)) || maxDate && isInclusivelyAfterDay(day, moment(maxDate));
    };                                                                                                                 // 11
  }                                                                                                                    // 11
                                                                                                                       //
  return setDateRange;                                                                                                 // 11
}();                                                                                                                   // 11
                                                                                                                       //
var DatePicker = function () {                                                                                         // 15
  function DatePicker(_ref) {                                                                                          // 15
    var minDate = _ref.minDate,                                                                                        // 15
        maxDate = _ref.maxDate,                                                                                        // 15
        props = (0, _objectWithoutProperties3.default)(_ref, ["minDate", "maxDate"]);                                  // 15
    // To prevent prop warnings                                                                                        // 16
    var otherProps = omit(props, ['autoFocus', 'autoComplete', 'className', 'onChange', 'onKeyUp', 'onKeyDown', 'value', 'name', 'defaultValue', 'type', 'rows']);
    return React.createElement(SingleDatePicker, (0, _extends3.default)({}, otherProps, {                              // 30
      numberOfMonths: 1,                                                                                               // 33
      hideKeyboardShortcutsPanel: true,                                                                                // 34
      showClearDate: true,                                                                                             // 35
      showDefaultInputIcon: true,                                                                                      // 36
      placeholder: "Choisissez",                                                                                       // 37
      firstDayOfWeek: 1,                                                                                               // 38
      enableOutsideDays: true,                                                                                         // 39
      isOutsideRange: minDate || maxDate ? setDateRange(minDate, maxDate) : undefined,                                 // 40
      displayFormat: "D MMMM YYYY"                                                                                     // 43
    }));                                                                                                               // 31
  }                                                                                                                    // 46
                                                                                                                       //
  return DatePicker;                                                                                                   // 15
}();                                                                                                                   // 15
                                                                                                                       //
DatePicker.propTypes = {                                                                                               // 48
  minDate: PropTypes.object,                                                                                           // 49
  maxDate: PropTypes.object                                                                                            // 50
};                                                                                                                     // 48
DatePicker.defaultProps = {                                                                                            // 53
  minDate: undefined,                                                                                                  // 54
  maxDate: undefined                                                                                                   // 55
};                                                                                                                     // 53
module.exportDefault(DatePicker);                                                                                      // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
//# sourceMappingURL=/dynamic/imports/core/components/DateInput/dfd420914a947bf8324ad37821e704c6b00066fe.map
