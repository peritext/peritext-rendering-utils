'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let styles = {};

/**
 * dumb component for rendering the structured representation of a cited element in the format of openUrl/Context Object in Span
 */
var StructuredCOinS = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(StructuredCOinS, _React$Component);

  function StructuredCOinS() {
    (0, _classCallCheck3.default)(this, StructuredCOinS);
    return (0, _possibleConstructorReturn3.default)(this, (StructuredCOinS.__proto__ || (0, _getPrototypeOf2.default)(StructuredCOinS)).apply(this, arguments));
  }

  (0, _createClass3.default)(StructuredCOinS, [{
    key: 'render',


    /**
     * render
     * @return {ReactElement} markup
     */


    /**
     * propTypes
     */
    value: function render() {
      var openUrl = void 0;
      if (this.props.resource) {
        openUrl = (0, _index.generateOpenUrl)((0, _index.resourceToCslJSON)(this.props.resource));
      } else if (this.props.cslRecord) {
        openUrl = (0, _index.generateOpenUrl)([this.props.cslRecord]);
      } else {
        return null;
      }
      return _react2.default.createElement('span', { className: 'peritext-structured-context-object-in-span-container Z3988', title: openUrl });
    }
  }]);
  return StructuredCOinS;
}(_react2.default.Component), _class.propTypes = {
  resource: _propTypes.PropTypes.object,
  cslRecord: _propTypes.PropTypes.object
}, _class.defaultProps = {}, _temp);
exports.default = StructuredCOinS;