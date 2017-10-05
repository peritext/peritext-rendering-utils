import React, {PropTypes} from 'react';
import {generateOpenUrl, resourceToCslJSON} from './index';

// let styles = {};

/**
 * dumb component for rendering the structured representation of a cited element in the format of openUrl/Context Object in Span
 */
export default class StructuredCOinS extends React.Component {

  /**
   * propTypes
   */
  static propTypes = {
    resource: PropTypes.object,
    cslRecord: PropTypes.object
  };

  static defaultProps = {
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    let openUrl;
    if (this.props.resource) {
      openUrl = generateOpenUrl(resourceToCslJSON(this.props.resource));
    } else if (this.props.cslRecord) {
      openUrl = generateOpenUrl([this.props.cslRecord]);
    } else {
      return null;
    }
    return (
      <span className="peritext-structured-context-object-in-span-container Z3988" title={openUrl}></span>
    );
  }
}