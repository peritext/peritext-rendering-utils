'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateOpenUrl = exports.bibToSchema = undefined;

var _resourceToCslJSON = require('./resourceToCslJSON');

var _resourceToCslJSON2 = _interopRequireDefault(_resourceToCslJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Translates a peritext bibType to a schema.org Type
 * @param {string} bib - the peritext bibType
 * @return {string} SchemaType - the corresponding SchemaType
 */
var bibToSchema = exports.bibToSchema = function bibToSchema(bib) {
  switch (bib) {
    case 'book':
      return 'Book';
    case 'article':
      return 'ScholarlyArticle';
    case 'booklet':
      return 'CreativeWork';
    case 'conference':
      return 'Chapter';
    case 'incollection':
      return 'Chapter';
    case 'inherits':
      return 'Chapter';
    case 'inbook':
      return 'Chapter';
    case 'mastersthesis':
      return 'Thesis';
    case 'phdthesis':
      return 'Thesis';
    case 'proceedings':
      return 'Book';
    case 'image':
      return 'ImageObject';
    case 'online':
      return 'WebSite';
    case 'vectorsImage':
      return 'ImageObject';
    case 'tabularData':
      return 'Dataset';
    case 'video':
      return 'VideoObject';
    case 'audio':
      return 'AudioObject';
    case 'person':
      return 'Person';
    case 'place':
      return 'Place';
    case 'organization':
      return 'Organization';
    // not very accurate
    case 'artefact':
      return 'Product';
    // no schematype for these ones (too abstract)
    case 'topic':
    case 'concept':
    case 'technology':
      return 'Thing';
    default:
      return 'CreativeWork';
  }
};

/*
  Context Objects in Spans (COiNS) related functions
*/

/**
 * Utils - Collection of utils for formatting scholarly citations in html+schema+RDFa+COiNS elements
 * @module utils/microDataUtils
 */
var addPropToCOinSData = function addPropToCOinSData(key, value) {
  return {
    key: key,
    value: value
  };
};

var urify = function urify(key, value) {
  return key + '=' + encodeURIComponent(value);
};

var assembleUri = function assembleUri() {
  var infos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var vals = [];
  infos.forEach(function (info) {
    vals.push(urify(info.key, info.value));
  });
  return vals.join('&amp;');
};

var baseMap = {
  'rft.atitle': 'title',
  'rft.date': 'date',
  'rft.pages': 'pages',
  'rft.issn': 'ISSN',
  'rft.isbn': 'ISBN',
  'rft_id': 'URL',
  'rft.place': 'address',
  'rft.pub': 'publisher'
};

var journalMap = {
  'rft.atitle': 'title',
  'rft.jtitle': 'journal',
  'rft.volume': 'volume',
  'rft.issue': 'issue'
};

var chapterMap = {
  'rft.atitle': 'title',
  'rft.btitle': 'booktitle'
};

var translate = function translate(data, item, map) {
  for (var key in map) {
    if (item[map[key]]) {
      data.push(addPropToCOinSData(key, item[map[key]]));
    }
  }
  return data;
};

/**
 * Generates an openUrl URI describing the resource, and aimed at being used in a ContextObjectInSpan (COinS)
 * @param {Object} resource - the resource to describe with an openUrl
 * @return {string} uri - the uri describing the resource
 */
var generateOpenUrl = exports.generateOpenUrl = function generateOpenUrl() {
  var citations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!citations.length) {
    return '';
  }
  var citation = citations[0];
  var data = [];
  data.push(addPropToCOinSData('ctx_ver', 'Z39.88-2004'));

  if (citation.author && citation.author.length) {
    citation.author.forEach(function (author) {
      var auth = author.given + ' ' + author.family;
      data.push(addPropToCOinSData('rft.au', auth));
    });
  }
  data = translate(data, citation, baseMap);
  if (citation.type === 'journal' || citation.type === 'article') {
    data = translate(data, citation, journalMap);
    data.push(addPropToCOinSData('rft.genre', 'article'));
    data.push(addPropToCOinSData('rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal'));
  } else if (citation.type === 'proceedings' || citation.type === 'conferencePaper') {
    data = translate(data, citation, journalMap);
    data.push(addPropToCOinSData('rft.genre', 'conference'));
    data.push(addPropToCOinSData('rft_val_fmt', 'info:ofi/fmt:kev:mtx:book'));
  } else if (citation.type === 'chapter') {
    data = translate(data, citation, chapterMap);
    data.push(addPropToCOinSData('rft.genre', 'bookitem'));
    data.push(addPropToCOinSData('rft_val_fmt', 'info:ofi/fmt:kev:mtx:book'));
  } else {
    data.push(addPropToCOinSData('rft.genre', 'document'));
  }
  return assembleUri(data);
};