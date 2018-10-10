import React from 'react';
import PlaceholderComponent from './placeholder';
import UndefinedComponent from './undefined';
import CmsEditButton from './cms-edit-button';
import jsonpointer from 'jsonpointer';
import { ComponentDefinitionsContext } from '../../context';
import getNestedObject from '../../utils/get-nested-object';

export default class ContentComponentWrapper extends React.Component {
  renderContentComponentWrapper(component, pageModel, content, preview, componentDefinitions, manageContentButton) {
    // based on the type of the component, render a different React component
    if (component.label in componentDefinitions && componentDefinitions[component.label].component) {
      // component is defined, so render the component
      const componentEl = React.createElement(componentDefinitions[component.label].component,
        { content: content, pageModel: pageModel, preview: preview, manageContentButton: manageContentButton }, null);
      return (componentEl);
    } else {
      // component not defined in component-definitions
      return (
        <UndefinedComponent name={component.label}/>
      );
    }
  }

  render() {
    const { configuration, pageModel, preview } = this.props;
    let content;

    // get content from model
    let contentRef = getNestedObject(configuration, ['models', 'document', '$ref']);
    if (!contentRef) {
      // NewsList component passed document ID through property instead of via reference in attributes map
      contentRef = this.props.contentRef;
    }

    if (contentRef && (typeof contentRef === 'string' || contentRef instanceof String)) {
      content = jsonpointer.get(pageModel, contentRef);
    }

    if (!content && preview) {
      // return placeholder if no document is set on component
      return (
        <PlaceholderComponent name={configuration.label} />
      );
    } else if (!content) {
      // don't render placeholder outside of preview mode
      return null;
    }

    // create edit content button and pass as a prop
    const manageContentButton = preview ? <CmsEditButton configuration={content} preview={preview} /> : null;

    return (
      <ComponentDefinitionsContext.Consumer>
        { componentDefinitions =>
          this.renderContentComponentWrapper(configuration, pageModel, content, preview, componentDefinitions,
            manageContentButton)
        }
      </ComponentDefinitionsContext.Consumer>
    );
  }
}