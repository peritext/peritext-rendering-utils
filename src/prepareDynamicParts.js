import {
  buildGlossary,
  buildCitations,
  buildBibliography,
  buildAuthorsIndex,
} from './index';

export default function (story) {
  const glossary = buildGlossary(story);
  const citations = buildCitations(story);
  const bibliography = buildBibliography(story, citations)
  const authorsIndex = buildAuthorsIndex(story);
  return {
    ...story,
    ...story.sectionsOrder.reduce((result, id) => ({
      ...result,
      [id]: story.sections[id],
    }), {}),
    glossary,
    citations,
    bibliography,
    authorsIndex,
  }
}