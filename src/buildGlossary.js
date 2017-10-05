import buildContextContent from './buildContextContent'
/**
 * Builds component-consumable data to represent
 * the glossary of "entities" resources being mentionned in the story
 * @param {object} story - the story to process
 * @return {array} glossaryMentions - all the glossary entries properly formatted for rendering
 */
export default function buildGlossary(
  story,
) {
    const {
      contextualizations,
      contextualizers,
      resources
    } = story;
    let glossaryMentions = Object.keys(contextualizations)
      .filter(contextualizationId => {
        const contextualizerId = contextualizations[contextualizationId].contextualizerId;
        const contextualizer = contextualizers[contextualizerId];
        return contextualizer && contextualizer.type === 'glossary';
      })
      .map(contextualizationId => ({
        ...contextualizations[contextualizationId],
        contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
        resource: resources[contextualizations[contextualizationId].resourceId],
        contextContent: buildContextContent(story, contextualizationId)
      }))
      .reduce((entries, contextualization) => {
        return {
          ...entries,
          [contextualization.resourceId]: {
            resource: contextualization.resource,
            mentions: entries[contextualization.resourceId] ?
                        entries[contextualization.resourceId].mentions.concat(contextualization)
                        : [contextualization]
          }
        };
      }, {});

    glossaryMentions = Object.keys(glossaryMentions)
                        .map(id => glossaryMentions[id])
                        .sort((a, b) => {
                          if (a.resource.data.name.toLowerCase() > b.resource.data.name.toLowerCase()) {
                            return 1;
                          }
                          else {
                            return -1;
                          }
                        });

    return glossaryMentions;
  }