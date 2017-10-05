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

exports.default = buildBibliography;

var _buildContextContent = require('./buildContextContent');

var _buildContextContent2 = _interopRequireDefault(_buildContextContent);

var _resourceToCslJSON = require('./resourceToCslJSON');

var _resourceToCslJSON2 = _interopRequireDefault(_resourceToCslJSON);

var _reactCiteproc = require('react-citeproc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the story
 * @param {object} story - the story to process
 * @param {object} citations - the citation data
 * @return {object} items - reference items ready to be visualized
 */
function buildBibliography(story, citations) {
  var contextualizations = story.contextualizations,
      contextualizers = story.contextualizers,
      resources = story.resources;
  /*
   * Assets preparation
   */

  var assets = (0, _keys2.default)(contextualizations).reduce(function (ass, id) {
    var contextualization = contextualizations[id];
    var contextualizer = contextualizers[contextualization.contextualizerId];
    return (0, _extends4.default)({}, ass, (0, _defineProperty3.default)({}, id, (0, _extends4.default)({}, contextualization, {
      resource: resources[contextualization.resourceId],
      contextualizer: contextualizer,
      type: contextualizer ? contextualizer.type : 'INLINE_ASSET'
    })));
  }, {});
  /*
   * Citations preparation
   */
  // isolate bib contextualizations
  var bibContextualizations = (0, _keys2.default)(assets).filter(function (assetKey) {
    return assets[assetKey].type !== 'glossary';
  }).map(function (assetKey) {
    return assets[assetKey];
  });

  var items = (0, _keys2.default)(citations.citationItems).map(function (citationKey) {
    var mentions = bibContextualizations.filter(function (contextualization) {
      return (0, _resourceToCslJSON2.default)(contextualization.resource)[0].id === citationKey;
    });
    var biblio = (0, _reactCiteproc.makeBibliography)(citations.citationItems, story.settings.citationStyle.data, story.settings.citationLocale.data, {
      select: [{
        field: 'id',
        value: citationKey
      }]
    });
    var title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey: citationKey,
      title: title,
      item: citations.citationItems[citationKey],
      mentions: mentions.map(function (mention) {
        return (0, _extends4.default)({}, mention, {
          contextContent: (0, _buildContextContent2.default)(story, mention.id)
        });
      })
    };
  });

  return items;
}