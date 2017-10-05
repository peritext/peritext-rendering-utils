'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = buildGlossary;

var _buildContextContent = require('./buildContextContent');

var _buildContextContent2 = _interopRequireDefault(_buildContextContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds component-consumable data to represent
 * the glossary of "entities" resources being mentionned in the story
 * @param {object} story - the story to process
 * @return {array} glossaryMentions - all the glossary entries properly formatted for rendering
 */
function buildGlossary(story) {
  var contextualizations = story.contextualizations,
      contextualizers = story.contextualizers,
      resources = story.resources;

  var glossaryMentions = (0, _keys2.default)(contextualizations).filter(function (contextualizationId) {
    var contextualizerId = contextualizations[contextualizationId].contextualizerId;
    var contextualizer = contextualizers[contextualizerId];
    return contextualizer && contextualizer.type === 'glossary';
  }).map(function (contextualizationId) {
    return (0, _extends4.default)({}, contextualizations[contextualizationId], {
      contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
      resource: resources[contextualizations[contextualizationId].resourceId],
      contextContent: (0, _buildContextContent2.default)(story, contextualizationId)
    });
  }).reduce(function (entries, contextualization) {
    return (0, _extends4.default)({}, entries, (0, _defineProperty3.default)({}, contextualization.resourceId, {
      resource: contextualization.resource,
      mentions: entries[contextualization.resourceId] ? entries[contextualization.resourceId].mentions.concat(contextualization) : [contextualization]
    }));
  }, {});

  glossaryMentions = (0, _keys2.default)(glossaryMentions).map(function (id) {
    return glossaryMentions[id];
  }).sort(function (a, b) {
    if (a.resource.data.name.toLowerCase() > b.resource.data.name.toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  });

  return glossaryMentions;
}