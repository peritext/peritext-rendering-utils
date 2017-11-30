

function findRelatedEntity (contents, contextualizationId) {
  return Object.keys(contents.entityMap).find(id => {
    const entity = contents.entityMap[id];
    if (entity.type === 'BLOCK_ASSET' || 
        entity.type === 'INLINE_ASSET' && 
        entity.data.asset) {
      const contId = entity.data.asset.id;
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
export default function buildContextContent(story, contextualizationId, padding = 0) {
  const contextualization = story.contextualizations[contextualizationId];
  const section = story.sections[contextualization.sectionId];
  if (section === undefined || section.metadata === undefined) {
    return;
  }
  const sectionTitle = section.metadata.title;
  const sectionId = section.id;
  // look in the entity map of the section
  // for the draft-js entity id linked to the contextualization
  let entityId;
  let targetContents;
  // search in main contents
  entityId = findRelatedEntity(section.contents, contextualizationId);
  if (entityId) {
    targetContents = 'main';
  }
  // search in notes
  else {
    Object.keys(section.notes).some(noteId => {
      const noteContents = section.notes[noteId].contents;
      entityId = findRelatedEntity(noteContents, contextualizationId);
      if (entityId) {
        targetContents = noteId;
        return true;
      }
    })
  }
  let contents = targetContents === 'main' ? 
    {...section.contents} : {...section.notes[targetContents].contents};

  if (entityId) {
    let blockIndex;
    contents.blocks.some((block, index) => {
      const entityRanges = block.entityRanges;
      const entityMatch = entityRanges.find(range => {
        if ('' + range.key === '' + entityId) {
          return range;
        }
      });
      if (entityMatch) {
        blockIndex = index;
        return true;
      }
    });
    const sliceFrom = blockIndex - padding >= 0 ? blockIndex - padding : 0;
    const sliceTo = blockIndex + padding + 1 <= contents.blocks.length - 1 ? blockIndex + padding + 1 : contents.blocks.length;

    contents = {
      ...contents,
      blocks: [
          ...contents.blocks.slice(sliceFrom, sliceTo)
        ]
    }
  }
  return {
    targetContents,
    contents,
    sectionTitle,
    sectionId,
  };
}