'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = buildCitations;

var _resourceToCslJSON = require('./resourceToCslJSON');

var _resourceToCslJSON2 = _interopRequireDefault(_resourceToCslJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the story
 * @param {object} story - the story to process
 * @return {object} citationData - the citation data to input in the reference manager
 */
function buildCitations(story, sectionId) {
  var _story$contextualizat = story.contextualizations,
      contextualizations = _story$contextualizat === undefined ? {} : _story$contextualizat,
      _story$contextualizer = story.contextualizers,
      contextualizers = _story$contextualizer === undefined ? {} : _story$contextualizer,
      _story$resources = story.resources,
      resources = _story$resources === undefined ? {} : _story$resources;
  /*
   * Assets preparation
   */

  var assets = (0, _keys2.default)(contextualizations).filter(function (id) {
    if (sectionId) {
      return contextualizations[id].sectionId === sectionId;
    }
    return true;
  }).reduce(function (ass, id) {
    var contextualization = contextualizations[id];
    var contextualizer = contextualizers[contextualization.contextualizerId];
    return (0, _extends5.default)({}, ass, (0, _defineProperty3.default)({}, id, (0, _extends5.default)({}, contextualization, {
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
    return assets[assetKey].type === 'bib';
  }).map(function (assetKey) {
    return assets[assetKey];
  });
  // build bibliography items
  var citationItems = (0, _keys2.default)(assets).filter(function (key) {
    return assets[key].resource.metadata.type !== 'glossary';
  }).reduce(function (finalCitations, key1) {
    var asset = assets[key1];
    var citations = (0, _resourceToCslJSON2.default)(asset.resource);
    // const citations = bibCit.resource.data;
    var newCitations = citations.reduce(function (final2, citation) {
      return (0, _extends5.default)({}, final2, (0, _defineProperty3.default)({}, citation.id, citation));
    }, {});
    return (0, _extends5.default)({}, finalCitations, newCitations);
  }, {});
  // build citations's citations data
  var citationInstances = bibContextualizations // Object.keys(bibContextualizations)
  .map(function (bibCit, index) {
    var key1 = bibCit.id;
    var contextualization = contextualizations[key1];

    var contextualizer = contextualizers[contextualization.contextualizerId];
    var resource = resources[contextualization.resourceId];
    return {
      citationID: key1,
      citationItems: (0, _resourceToCslJSON2.default)(resource).map(function (ref) {
        return {
          locator: contextualizer.locator,
          prefix: contextualizer.prefix,
          suffix: contextualizer.suffix,
          // ...contextualizer,
          id: ref.id
        };
      }),
      properties: {
        noteIndex: index + 1
      }
    };
  });
  // map the citation instances to the clumsy formatting needed by citeProc
  var citationData = citationInstances.map(function (instance, index) {
    return [instance,
    // citations before
    citationInstances.slice(0, index === 0 ? 0 : index).map(function (oCitation) {
      return [oCitation.citationID, oCitation.properties.noteIndex];
    }), []
    // citations after the current citation
    // this is claimed to be needed by citeproc.js
    // but it works without it so ¯\_(ツ)_/¯
    // citationInstances.slice(index)
    //   .map((oCitation) => [
    //       oCitation.citationID,
    //       oCitation.properties.noteIndex
    //     ]
    //   ),
    ];
  });
  return {
    citationData: citationData,
    citationItems: citationItems
  };
}