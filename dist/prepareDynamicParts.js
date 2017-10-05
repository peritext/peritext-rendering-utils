'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.default = function (story) {
  var glossary = (0, _index.buildGlossary)(story);
  var citations = (0, _index.buildCitations)(story);
  var bibliography = (0, _index.buildBibliography)(story, citations);
  var authorsIndex = (0, _index.buildAuthorsIndex)(story);
  return (0, _extends4.default)({}, story, story.sectionsOrder.reduce(function (result, id) {
    return (0, _extends4.default)({}, result, (0, _defineProperty3.default)({}, id, story.sections[id]));
  }, {}), {
    glossary: glossary,
    citations: citations,
    bibliography: bibliography,
    authorsIndex: authorsIndex
  });
};

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }