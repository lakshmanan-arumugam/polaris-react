import React, { Children, isValidElement } from 'react';

// `Component`. If `props` is passed, those will be added as props on the
// wrapped component. If `element` is null, the component is not wrapped.

function wrapWithComponent(element, Component, props) {
  if (element == null) {
    return null;
  }

  return isElementOfType(element, Component) ? element : /*#__PURE__*/React.createElement(Component, props, element);
} // In development, we compare based on the name of the function because
// React Hot Loader proxies React components in order to make updates. In
// production we can simply compare the components for equality.

const isComponent = process.env.NODE_ENV === 'development' ? hotReloadComponentCheck : (AComponent, AnotherComponent) => AComponent === AnotherComponent; // Checks whether `element` is a React element of type `Component` (or one of
// the passed components, if `Component` is an array of React components).

function isElementOfType(element, Component) {
  var _element$props;

  if (element == null || ! /*#__PURE__*/isValidElement(element) || typeof element.type === 'string') {
    return false;
  }

  const {
    type: defaultType
  } = element; // Type override allows components to bypass default wrapping behavior. Ex: Stack, ResourceList...
  // See https://github.com/Shopify/app-extension-libs/issues/996#issuecomment-710437088

  const overrideType = (_element$props = element.props) === null || _element$props === void 0 ? void 0 : _element$props.__type__;
  const type = overrideType || defaultType;
  const Components = Array.isArray(Component) ? Component : [Component];
  return Components.some(AComponent => typeof type !== 'string' && isComponent(AComponent, type));
} // Returns all children that are valid elements as an array. Can optionally be
// filtered by passing `predicate`.

function elementChildren(children, predicate = () => true) {
  return Children.toArray(children).filter(child => /*#__PURE__*/isValidElement(child) && predicate(child));
}
function ConditionalWrapper({
  condition,
  wrapper,
  children
}) {
  return condition ? wrapper(children) : children;
}
function ConditionalRender({
  condition,
  children
}) {
  return condition ? children : null;
}

function hotReloadComponentCheck(AComponent, AnotherComponent) {
  const componentName = AComponent.name;
  const anotherComponentName = AnotherComponent.displayName;
  return AComponent === AnotherComponent || Boolean(componentName) && componentName === anotherComponentName;
}

export { ConditionalRender, ConditionalWrapper, elementChildren, isElementOfType, wrapWithComponent };
