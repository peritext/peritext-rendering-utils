import buildContextContent from './buildContextContent';
import resourceToCslJSON from './resourceToCslJSON';

import {makeBibliography} from 'react-citeproc';
/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the story
 * @param {object} story - the story to process
 * @param {object} citations - the citation data
 * @return {object} items - reference items ready to be visualized
 */
export default function buildBibliography (
  story, 
  citations,
) {

  const {
    contextualizations,
    contextualizers,
    resources
  } = story;
  /*
   * Assets preparation
   */
  const assets = Object.keys(contextualizations)
  .reduce((ass, id) => {
    const contextualization = contextualizations[id];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    return {
      ...ass,
      [id]: {
        ...contextualization,
        resource: resources[contextualization.resourceId],
        contextualizer,
        type: contextualizer ? contextualizer.type : 'INLINE_ASSET'
      }
    };
  }, {});
  /*
   * Citations preparation
   */
  // isolate bib contextualizations
  const bibContextualizations = Object.keys(assets)
  .filter(assetKey =>
      assets[assetKey].type !== 'glossary'
    )
  .map(assetKey => assets[assetKey]);

  const items = Object.keys(citations.citationItems).map(citationKey => {
    const mentions = bibContextualizations.filter(contextualization => {
      return resourceToCslJSON(contextualization.resource)[0].id === citationKey;
    });
    const biblio = makeBibliography(
      citations.citationItems,
      story.settings.citationStyle.data,
      story.settings.citationLocale.data,
      {
        select: [{
          field: 'id',
          value: citationKey
        }]
      }
    );
    const title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey,
      title,
      item: citations.citationItems[citationKey],
      mentions: mentions.map(mention => ({
        ...mention,
        contextContent: buildContextContent(story, mention.id)
      }))
    }
  });

  return items;
}


