import buildContextContent from './buildContextContent'
import resourceToCslJSON from './resourceToCslJSON'
import slugify from 'slugify';
/**
 * Builds component-consumable data to represent
 * the index of authors mentionned in the story
 * @param {object} story - the story to process
 * @return {array} authorsNameMentions - all the glossary entries properly formatted for rendering
 */
export default function buildAuthorsIndex(story) {
    const {
      contextualizations,
      contextualizers,
      resources
    } = story;
    let authorsNameMentions = Object.keys(contextualizations)
      // .filter(contextualizationId => {
      //   const contextualizerId = contextualizations[contextualizationId].contextualizerId;
      //   const contextualizer = contextualizers[contextualizerId];
      //   return contextualizer && contextualizer.type === 'bib';
      // })
      .map(contextualizationId => ({
        ...contextualizations[contextualizationId],
        contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
        resource: resources[contextualizations[contextualizationId].resourceId],
        contextContent: buildContextContent(story, contextualizationId),
      }))
      .reduce((entries, contextualization) => {
        const resource = contextualization.resource;
        // handling bib resources
        if (
            resource /*&& 
            resource.metadata.type === 'bib' &&
            resource.data && 
            Array.isArray(resource.data) &&
            resource.data.length &&
            resource.data[0] && 
            resource.data[0].author*/
          ) {
          const normalized = resourceToCslJSON(resource) || [];
          return normalized
          .filter(norm => norm.author !== undefined)
          .reduce((authors, entr) => authors.concat(entr.author), [])
          .reduce((finalEntries, author) => {
            if (author.given === undefined) {
              return finalEntries;
            }
            // todo: what about homonyms ?
            const id = slugify((author.family + ' ' + author.given).toLowerCase());
            if (finalEntries[id]) {
              return {
                ...finalEntries,
                [id]: {
                  ...finalEntries[id],
                  mentions: [
                    ...finalEntries[id].mentions,
                    contextualization
                  ]
                }
              } 
            } else {
              return {
                ...finalEntries,
                [id]: {
                  ...author,
                  id,
                  mentions: [contextualization]
                }
              }
            }
          }, entries);
          return entries;
        }
        return entries;
      }, {});
    authorsNameMentions = Object.keys(authorsNameMentions)
                        .map(id => authorsNameMentions[id])
                        .sort((a, b) => {
                          if (a.given > b.given) {
                            return -1;
                          }
                          else {
                            return 1;
                          }
                        });

    return authorsNameMentions;
  }