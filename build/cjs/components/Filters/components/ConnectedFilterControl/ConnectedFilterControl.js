'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var css = require('../../../../utilities/css.js');
var ConnectedFilterControl$1 = require('./ConnectedFilterControl.scss.js');
var Item = require('./components/Item/Item.js');
var EventListener = require('../../../EventListener/EventListener.js');
var Button = require('../../../Button/Button.js');
var Popover = require('../../../Popover/Popover.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

const FILTER_FIELD_MIN_WIDTH = 150;
class ConnectedFilterControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      availableWidth: 0,
      proxyButtonsWidth: {}
    };
    this.container = /*#__PURE__*/React.createRef();
    this.proxyButtonContainer = /*#__PURE__*/React.createRef();
    this.moreFiltersButtonContainer = /*#__PURE__*/React.createRef();
    this.handleResize = debounce__default['default'](() => {
      this.measureProxyButtons();
      this.measureAvailableWidth();
    }, 40, {
      leading: true,
      trailing: true,
      maxWait: 40
    });
  }

  componentDidMount() {
    this.handleResize();
  }

  render() {
    const {
      children,
      rightPopoverableActions,
      rightAction,
      auxiliary,
      forceShowMorefiltersButton = true,
      queryFieldHidden
    } = this.props;
    const actionsToRender = rightPopoverableActions != null ? this.getActionsToRender(rightPopoverableActions) : [];
    const className = css.classNames(ConnectedFilterControl$1['default'].ConnectedFilterControl, rightPopoverableActions && ConnectedFilterControl$1['default'].right);
    const shouldRenderMoreFiltersButton = forceShowMorefiltersButton || rightPopoverableActions && rightPopoverableActions.length !== actionsToRender.length;
    const RightContainerClassName = css.classNames(ConnectedFilterControl$1['default'].RightContainer, !shouldRenderMoreFiltersButton && ConnectedFilterControl$1['default'].RightContainerWithoutMoreFilters, queryFieldHidden && ConnectedFilterControl$1['default'].queryFieldHidden);
    const rightMarkup = actionsToRender.length > 0 ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: RightContainerClassName
    }, this.popoverFrom(actionsToRender)) : null;
    const moreFiltersButtonContainerClassname = css.classNames(ConnectedFilterControl$1['default'].MoreFiltersButtonContainer, actionsToRender.length === 0 && ConnectedFilterControl$1['default'].onlyButtonVisible);
    const rightActionMarkup = rightAction ? /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.moreFiltersButtonContainer,
      className: moreFiltersButtonContainerClassname
    }, shouldRenderMoreFiltersButton && /*#__PURE__*/React__default['default'].createElement(Item.Item, null, rightAction)) : null;
    const proxyButtonMarkup = rightPopoverableActions ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: ConnectedFilterControl$1['default'].ProxyButtonContainer,
      ref: this.proxyButtonContainer,
      "aria-hidden": true
    }, rightPopoverableActions.map(action => /*#__PURE__*/React__default['default'].createElement("div", {
      key: action.key,
      "data-key": action.key
    }, this.activatorButtonFrom(action, {
      proxy: true
    })))) : null;
    const auxMarkup = auxiliary ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: ConnectedFilterControl$1['default'].AuxiliaryContainer
    }, auxiliary) : null;
    return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, proxyButtonMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
      className: ConnectedFilterControl$1['default'].Wrapper
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: className,
      ref: this.container
    }, children ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: ConnectedFilterControl$1['default'].CenterContainer
    }, /*#__PURE__*/React__default['default'].createElement(Item.Item, null, children)) : null, rightMarkup, rightActionMarkup, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "resize",
      handler: this.handleResize
    })), auxMarkup));
  }

  measureProxyButtons() {
    if (this.proxyButtonContainer.current) {
      const proxyButtonsWidth = {}; // this number is magical, but tweaking it solved the problem of items overlapping

      const tolerance = 78;

      if (this.proxyButtonContainer.current) {
        Array.from(this.proxyButtonContainer.current.children).forEach(element => {
          const buttonWidth = element.getBoundingClientRect().width + tolerance;
          const buttonKey = element instanceof HTMLElement && element.dataset.key;

          if (buttonKey) {
            proxyButtonsWidth[buttonKey] = buttonWidth;
          }
        });
      }

      this.setState({
        proxyButtonsWidth
      });
    }
  }

  measureAvailableWidth() {
    if (this.container.current && this.moreFiltersButtonContainer.current) {
      const containerWidth = this.container.current.getBoundingClientRect().width;
      const moreFiltersButtonWidth = this.moreFiltersButtonContainer.current.getBoundingClientRect().width;
      const filtersActionWidth = 0;
      const filterFieldMinWidth = this.props.queryFieldHidden ? 0 : FILTER_FIELD_MIN_WIDTH;
      const availableWidth = containerWidth - filterFieldMinWidth - moreFiltersButtonWidth - filtersActionWidth;
      this.setState({
        availableWidth
      });
    }
  }

  getActionsToRender(actions) {
    let remainingWidth = this.state.availableWidth;
    const actionsToReturn = [];

    for (let i = 0; remainingWidth > 0 && i < actions.length; i++) {
      const action = actions[i];
      const actionWidth = this.state.proxyButtonsWidth[action.key];

      if (actionWidth <= remainingWidth) {
        actionsToReturn.push(action);
        remainingWidth -= actionWidth;
      } else {
        // When we can't fit an action, we break the loop.
        // The ones that didn't fit will be accessible through the "More filters" button
        break;
      }
    }

    return actionsToReturn;
  }

  activatorButtonFrom(action, options) {
    const id = options !== null && options !== void 0 && options.proxy ? undefined : `Activator-${action.key}`;
    return /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: action.onAction,
      disclosure: true,
      disabled: this.props.disabled || action.disabled,
      id: id
    }, action.content);
  }

  popoverFrom(actions) {
    return actions.map(action => {
      return /*#__PURE__*/React__default['default'].createElement(Item.Item, {
        key: action.key
      }, /*#__PURE__*/React__default['default'].createElement(Popover.Popover, {
        active: action.popoverOpen,
        activator: this.activatorButtonFrom(action),
        onClose: action.onAction,
        preferredAlignment: "left",
        sectioned: true
      }, action.popoverContent));
    });
  }

}

exports.ConnectedFilterControl = ConnectedFilterControl;
