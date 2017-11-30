'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = buildContextContent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findRelatedEntity(contents, contextualizationId) {
  return (0, _keys2.default)(contents.entityMap).find(function (id) {
    var entity = contents.entityMap[id];
    if (entity.type === 'BLOCK_ASSET' || entity.type === 'INLINE_ASSET' && entity.data.asset) {
      var contId = entity.data.asset.id;
      if (contId === contextualizationId) {
        return id;
      }
    }
  });
}

/**
 * Creates a Draft-js's raw representation of the content surrounding a given contextualization
 * @param {object} story - the story's json
 * @param {string} contextualizationId - id of the contextualization id
 * @param {number} padding - number of blocks before and after contextualization's block to integrate within the content state
 * @return {object} rawContent - a draft-js raw representation of returned content state
 */
function buildContextContent(story, contextualizationId) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var contextualization = story.contextualizations[contextualizationId];
  var section = story.sections[contextualization.sectionId];
  if (section === undefined || section.metadata === undefined) {
    return;
  }
  var sectionTitle = section.metadata.title;
  var sectionId = section.id;
  // look in the entity map of the section
  // for the draft-js entity id linked to the contextualization
  var entityId = void 0;
  var targetContents = void 0;
  // search in main contents
  entityId = findRelatedEntity(section.contents, contextualizationId);
  if (entityId) {
    targetContents = 'main';
  }
  // search in notes
  else {
      (0, _keys2.default)(section.notes).some(function (noteId) {
        var noteContents = section.notes[noteId].contents;
        entityId = findRelatedEntity(noteContents, contextualizationId);
        if (entityId) {
          targetContents = noteId;
          return true;
        }
      });
    }
  var contents = targetContents === 'main' ? (0, _extends3.default)({}, section.contents) : (0, _extends3.default)({}, section.notes[targetContents].contents);

  if (entityId) {
    var blockIndex = void 0;
    contents.blocks.some(function (block, index) {
      var entityRanges = block.entityRanges;
      var entityMatch = entityRanges.find(function (range) {
        if ('' + range.key === '' + entityId) {
          return range;
        }
      });
      if (entityMatch) {
        blockIndex = index;
        return true;
      }
    });
    var sliceFrom = blockIndex - padding >= 0 ? blockIndex - padding : 0;
    var sliceTo = blockIndex + padding + 1 <= contents.blocks.length - 1 ? blockIndex + padding + 1 : contents.blocks.length;

    contents = (0, _extends3.default)({}, contents, {
      blocks: [].concat((0, _toConsumableArray3.default)(contents.blocks.slice(sliceFrom, sliceTo)))
    });
  }
  return {
    targetContents: targetContents,
    contents: contents,
    sectionTitle: sectionTitle,
    sectionId: sectionId
  };
}