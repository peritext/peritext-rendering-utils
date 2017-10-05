'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = buildAuthorsIndex;

var _buildContextContent = require('./buildContextContent');

var _buildContextContent2 = _interopRequireDefault(_buildContextContent);

var _resourceToCslJSON = require('./resourceToCslJSON');

var _resourceToCslJSON2 = _interopRequireDefault(_resourceToCslJSON);

var _slugify = require('slugify');

var _slugify2 = _interopRequireDefault(_slugify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds component-consumable data to represent
 * the index of authors mentionned in the story
 * @param {object} story - the story to process
 * @return {array} authorsNameMentions - all the glossary entries properly formatted for rendering
 */
function buildAuthorsIndex(story) {
  var contextualizations = story.contextualizations,
      contextualizers = story.contextualizers,
      resources = story.resources;

  var authorsNameMentions = (0, _keys2.default)(contextualizations)
  // .filter(contextualizationId => {
  //   const contextualizerId = contextualizations[contextualizationId].contextualizerId;
  //   const contextualizer = contextualizers[contextualizerId];
  //   return contextualizer && contextualizer.type === 'bib';
  // })
  .map(function (contextualizationId) {
    return (0, _extends5.default)({}, contextualizations[contextualizationId], {
      contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
      resource: resources[contextualizations[contextualizationId].resourceId],
      contextContent: (0, _buildContextContent2.default)(story, contextualizationId)
    });
  }).reduce(function (entries, contextualization) {
    var resource = contextualization.resource;
    // handling bib resources
    if (resource /*&& 
                 resource.metadata.type === 'bib' &&
                 resource.data && 
                 Array.isArray(resource.data) &&
                 resource.data.length &&
                 resource.data[0] && 
                 resource.data[0].author*/
    ) {
        var normalized = (0, _resourceToCslJSON2.default)(resource) || [];
        return normalized.filter(function (norm) {
          return norm.author !== undefined;
        }).reduce(function (authors, entr) {
          return authors.concat(entr.author);
        }, []).reduce(function (finalEntries, author) {
          if (author.given === undefined) {
            return finalEntries;
          }
          // todo: what about homonyms ?
          var id = (0, _slugify2.default)((author.family + ' ' + author.given).toLowerCase());
          if (finalEntries[id]) {
            return (0, _extends5.default)({}, finalEntries, (0, _defineProperty3.default)({}, id, (0, _extends5.default)({}, finalEntries[id], {
              mentions: [].concat((0, _toConsumableArray3.default)(finalEntries[id].mentions), [contextualization])
            })));
          } else {
            return (0, _extends5.default)({}, finalEntries, (0, _defineProperty3.default)({}, id, (0, _extends5.default)({}, author, {
              id: id,
              mentions: [contextualization]
            })));
          }
        }, entries);
        return entries;
      }
    return entries;
  }, {});
  authorsNameMentions = (0, _keys2.default)(authorsNameMentions).map(function (id) {
    return authorsNameMentions[id];
  }).sort(function (a, b) {
    if (a.given > b.given) {
      return -1;
    } else {
      return 1;
    }
  });

  return authorsNameMentions;
}