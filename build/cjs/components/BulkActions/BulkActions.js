'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var polarisTokens = require('@shopify/polaris-tokens');
var reactTransitionGroup = require('react-transition-group');
var css = require('../../utilities/css.js');
var clamp = require('../../utilities/clamp.js');
var BulkActions$1 = require('./BulkActions.scss.js');
var BulkActionMenu = require('./components/BulkActionMenu/BulkActionMenu.js');
var CheckableButton = require('../CheckableButton/CheckableButton.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Button = require('../Button/Button.js');
var Popover = require('../Popover/Popover.js');
var BulkActionButton = require('./components/BulkActionButton/BulkActionButton.js');
var ActionList = require('../ActionList/ActionList.js');
var ButtonGroup = require('../ButtonGroup/ButtonGroup.js');
var EventListener = require('../EventListener/EventListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

const MAX_PROMOTED_ACTIONS = 2;
const slideClasses = {
  appear: css.classNames(BulkActions$1['default'].Slide, BulkActions$1['default']['Slide-appear']),
  appearActive: css.classNames(BulkActions$1['default'].Slide, BulkActions$1['default']['Slide-appearing']),
  enter: css.classNames(BulkActions$1['default'].Slide, BulkActions$1['default']['Slide-enter']),
  enterActive: css.classNames(BulkActions$1['default'].Slide, BulkActions$1['default']['Slide-entering']),
  exit: css.classNames(BulkActions$1['default'].Slide, BulkActions$1['default']['Slide-exit'])
};

class BulkActionsInner extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      smallScreenPopoverVisible: false,
      largeScreenPopoverVisible: false,
      containerWidth: 0,
      measuring: true
    };
    this.containerNode = null;
    this.largeScreenButtonsNode = null;
    this.moreActionsNode = null;
    this.checkableWrapperNode = /*#__PURE__*/React.createRef();
    this.largeScreenGroupNode = /*#__PURE__*/React.createRef();
    this.smallScreenGroupNode = /*#__PURE__*/React.createRef();
    this.promotedActionsWidths = [];
    this.bulkActionsWidth = 0;
    this.addedMoreActionsWidthForMeasuring = 0;
    this.handleResize = debounce__default['default'](() => {
      const {
        smallScreenPopoverVisible,
        largeScreenPopoverVisible
      } = this.state;

      if (this.containerNode) {
        const containerWidth = this.containerNode.getBoundingClientRect().width;

        if (containerWidth > 0) {
          this.setState({
            containerWidth
          });
        }
      }

      if (smallScreenPopoverVisible || largeScreenPopoverVisible) {
        this.setState({
          smallScreenPopoverVisible: false,
          largeScreenPopoverVisible: false
        });
      }
    }, 50, {
      trailing: true
    });

    this.setLargeScreenButtonsNode = node => {
      this.largeScreenButtonsNode = node;
    };

    this.setContainerNode = node => {
      this.containerNode = node;
    };

    this.setMoreActionsNode = node => {
      this.moreActionsNode = node;
    };

    this.setSelectMode = val => {
      const {
        onSelectModeToggle
      } = this.props;

      if (onSelectModeToggle) {
        onSelectModeToggle(val);
      }
    };

    this.toggleSmallScreenPopover = () => {
      if (this.props.onMoreActionPopoverToggle) {
        this.props.onMoreActionPopoverToggle(this.state.smallScreenPopoverVisible);
      }

      this.setState(({
        smallScreenPopoverVisible
      }) => ({
        smallScreenPopoverVisible: !smallScreenPopoverVisible
      }));
    };

    this.toggleLargeScreenPopover = () => {
      if (this.props.onMoreActionPopoverToggle) {
        this.props.onMoreActionPopoverToggle(this.state.largeScreenPopoverVisible);
      }

      this.setState(({
        largeScreenPopoverVisible
      }) => ({
        largeScreenPopoverVisible: !largeScreenPopoverVisible
      }));
    };

    this.handleMeasurement = width => {
      const {
        measuring
      } = this.state;

      if (measuring) {
        this.promotedActionsWidths.push(width);
      }
    };
  }

  numberOfPromotedActionsToRender() {
    const {
      promotedActions
    } = this.props;
    const {
      containerWidth,
      measuring
    } = this.state;

    if (!promotedActions) {
      return 0;
    }

    if (containerWidth >= this.bulkActionsWidth || measuring) {
      return promotedActions.length;
    }

    let sufficientSpace = false;
    let counter = promotedActions.length - 1;
    let totalWidth = 0;

    while (!sufficientSpace && counter >= 0) {
      totalWidth += this.promotedActionsWidths[counter];
      const widthWithRemovedAction = this.bulkActionsWidth - totalWidth + this.addedMoreActionsWidthForMeasuring;

      if (containerWidth >= widthWithRemovedAction) {
        sufficientSpace = true;
      } else {
        counter--;
      }
    }

    return clamp.clamp(counter, 0, promotedActions.length);
  }

  hasActions() {
    const {
      promotedActions,
      actions
    } = this.props;
    return Boolean(promotedActions && promotedActions.length > 0 || actions && actions.length > 0);
  }

  actionSections() {
    const {
      actions
    } = this.props;

    if (!actions || actions.length === 0) {
      return;
    }

    if (instanceOfBulkActionListSectionArray(actions)) {
      return actions;
    }

    if (instanceOfBulkActionArray(actions)) {
      return [{
        items: actions
      }];
    }
  }

  rolledInPromotedActions() {
    const {
      promotedActions
    } = this.props;
    const numberOfPromotedActionsToRender = this.numberOfPromotedActionsToRender();

    if (!promotedActions || promotedActions.length === 0 || numberOfPromotedActionsToRender >= promotedActions.length) {
      return [];
    }

    const rolledInPromotedActions = promotedActions.map(action => {
      if (instanceOfMenuGroupDescriptor(action)) {
        return {
          items: [...action.actions]
        };
      }

      return {
        items: [action]
      };
    });
    return rolledInPromotedActions.slice(numberOfPromotedActionsToRender);
  } // eslint-disable-next-line @typescript-eslint/member-ordering


  componentDidMount() {
    const {
      actions,
      promotedActions
    } = this.props;

    if (promotedActions && !actions && this.moreActionsNode) {
      this.addedMoreActionsWidthForMeasuring = this.moreActionsNode.getBoundingClientRect().width;
    }

    this.bulkActionsWidth = this.largeScreenButtonsNode ? this.largeScreenButtonsNode.getBoundingClientRect().width - this.addedMoreActionsWidthForMeasuring : 0;

    if (this.containerNode) {
      this.setState({
        containerWidth: this.containerNode.getBoundingClientRect().width,
        measuring: false
      });
    }
  } // eslint-disable-next-line @typescript-eslint/member-ordering


  render() {
    const {
      selectMode,
      accessibilityLabel,
      label = '',
      onToggleAll,
      selected,
      smallScreen,
      disabled,
      promotedActions,
      paginatedSelectAllText = null,
      paginatedSelectAllAction,
      i18n
    } = this.props;
    const actionSections = this.actionSections();

    if (promotedActions && promotedActions.length > MAX_PROMOTED_ACTIONS && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(i18n.translate('Polaris.ResourceList.BulkActions.warningMessage', {
        maxPromotedActions: MAX_PROMOTED_ACTIONS
      }));
    }

    const {
      smallScreenPopoverVisible,
      largeScreenPopoverVisible,
      measuring
    } = this.state;
    const paginatedSelectAllActionMarkup = paginatedSelectAllAction ? /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: paginatedSelectAllAction.onAction,
      plain: true,
      disabled: disabled
    }, paginatedSelectAllAction.content) : null;
    const paginatedSelectAllTextMarkup = paginatedSelectAllText && paginatedSelectAllAction ? /*#__PURE__*/React__default['default'].createElement("span", {
      "aria-live": "polite"
    }, paginatedSelectAllText) : paginatedSelectAllText;
    const paginatedSelectAllMarkup = paginatedSelectAllActionMarkup || paginatedSelectAllTextMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: BulkActions$1['default'].PaginatedSelectAll
    }, paginatedSelectAllTextMarkup, " ", paginatedSelectAllActionMarkup) : null;
    const cancelButton = /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: this.setSelectMode.bind(this, false),
      disabled: disabled
    }, i18n.translate('Polaris.Common.cancel'));
    const numberOfPromotedActionsToRender = this.numberOfPromotedActionsToRender();
    const allActionsPopover = this.hasActions() ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: BulkActions$1['default'].Popover,
      ref: this.setMoreActionsNode
    }, /*#__PURE__*/React__default['default'].createElement(Popover.Popover, {
      active: smallScreenPopoverVisible,
      activator: /*#__PURE__*/React__default['default'].createElement(BulkActionButton.BulkActionButton, {
        disclosure: true,
        onAction: this.toggleSmallScreenPopover,
        content: i18n.translate('Polaris.ResourceList.BulkActions.actionsActivatorLabel'),
        disabled: disabled,
        indicator: this.isNewBadgeInBadgeActions()
      }),
      onClose: this.toggleSmallScreenPopover
    }, /*#__PURE__*/React__default['default'].createElement(ActionList.ActionList, {
      items: promotedActions,
      sections: actionSections,
      onActionAnyItem: this.toggleSmallScreenPopover
    }))) : null;
    const promotedActionsMarkup = promotedActions && numberOfPromotedActionsToRender > 0 ? [...promotedActions].slice(0, numberOfPromotedActionsToRender).map((action, index) => {
      if (instanceOfMenuGroupDescriptor(action)) {
        return /*#__PURE__*/React__default['default'].createElement(BulkActionMenu.BulkActionMenu, Object.assign({
          key: index
        }, action, {
          isNewBadgeInBadgeActions: this.isNewBadgeInBadgeActions()
        }));
      }

      return /*#__PURE__*/React__default['default'].createElement(BulkActionButton.BulkActionButton, Object.assign({
        key: index,
        disabled: disabled
      }, action, {
        handleMeasurement: this.handleMeasurement
      }));
    }) : null;
    const rolledInPromotedActions = this.rolledInPromotedActions();
    const activatorLabel = !promotedActions || promotedActions && numberOfPromotedActionsToRender === 0 && !measuring ? i18n.translate('Polaris.ResourceList.BulkActions.actionsActivatorLabel') : i18n.translate('Polaris.ResourceList.BulkActions.moreActionsActivatorLabel');
    let combinedActions = [];

    if (actionSections && rolledInPromotedActions.length > 0) {
      combinedActions = [...rolledInPromotedActions, ...actionSections];
    } else if (actionSections) {
      combinedActions = actionSections;
    } else if (rolledInPromotedActions.length > 0) {
      combinedActions = [...rolledInPromotedActions];
    }

    const actionsPopover = actionSections || rolledInPromotedActions.length > 0 || measuring ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: BulkActions$1['default'].Popover,
      ref: this.setMoreActionsNode
    }, /*#__PURE__*/React__default['default'].createElement(Popover.Popover, {
      active: largeScreenPopoverVisible,
      activator: /*#__PURE__*/React__default['default'].createElement(BulkActionButton.BulkActionButton, {
        disclosure: true,
        onAction: this.toggleLargeScreenPopover,
        content: activatorLabel,
        disabled: disabled,
        indicator: this.isNewBadgeInBadgeActions()
      }),
      onClose: this.toggleLargeScreenPopover
    }, /*#__PURE__*/React__default['default'].createElement(ActionList.ActionList, {
      sections: combinedActions,
      onActionAnyItem: this.toggleLargeScreenPopover
    }))) : null;
    const checkableButtonProps = {
      accessibilityLabel,
      label,
      selected,
      selectMode,
      onToggleAll,
      measuring,
      disabled
    };
    const smallScreenGroup = smallScreen ? /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.Transition, {
      timeout: 0,
      in: selectMode,
      key: "smallGroup",
      nodeRef: this.smallScreenGroupNode
    }, status => {
      const smallScreenGroupClassName = css.classNames(BulkActions$1['default'].Group, BulkActions$1['default']['Group-smallScreen'], BulkActions$1['default'][`Group-${status}`]);
      return /*#__PURE__*/React__default['default'].createElement("div", {
        className: smallScreenGroupClassName,
        ref: this.smallScreenGroupNode
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: BulkActions$1['default'].ButtonGroupWrapper
      }, /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, {
        segmented: true
      }, /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.CSSTransition, {
        nodeRef: this.checkableWrapperNode,
        in: selectMode,
        timeout: polarisTokens.durationBase,
        classNames: slideClasses,
        appear: !selectMode
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: BulkActions$1['default'].CheckableContainer,
        ref: this.checkableWrapperNode
      }, /*#__PURE__*/React__default['default'].createElement(CheckableButton.CheckableButton, Object.assign({}, checkableButtonProps, {
        smallScreen: true
      })))), allActionsPopover, cancelButton)), paginatedSelectAllMarkup);
    }) : null;
    const largeGroupContent = promotedActionsMarkup || actionsPopover ? /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, {
      segmented: true
    }, /*#__PURE__*/React__default['default'].createElement(CheckableButton.CheckableButton, checkableButtonProps), promotedActionsMarkup, actionsPopover) : /*#__PURE__*/React__default['default'].createElement(CheckableButton.CheckableButton, checkableButtonProps);
    const largeScreenGroup = smallScreen ? null : /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.Transition, {
      timeout: 0,
      in: selectMode,
      key: "largeGroup",
      nodeRef: this.largeScreenGroupNode
    }, status => {
      const largeScreenGroupClassName = css.classNames(BulkActions$1['default'].Group, BulkActions$1['default']['Group-largeScreen'], !measuring && BulkActions$1['default'][`Group-${status}`], measuring && BulkActions$1['default']['Group-measuring']);
      return /*#__PURE__*/React__default['default'].createElement("div", {
        className: largeScreenGroupClassName,
        ref: this.largeScreenGroupNode
      }, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
        event: "resize",
        handler: this.handleResize
      }), /*#__PURE__*/React__default['default'].createElement("div", {
        className: BulkActions$1['default'].ButtonGroupWrapper,
        ref: this.setLargeScreenButtonsNode
      }, largeGroupContent), paginatedSelectAllMarkup);
    });
    return /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.setContainerNode
    }, smallScreenGroup, largeScreenGroup);
  }

  isNewBadgeInBadgeActions() {
    const actions = this.actionSections();
    if (!actions) return false;

    for (const action of actions) {
      for (const item of action.items) {
        var _item$badge;

        if (((_item$badge = item.badge) === null || _item$badge === void 0 ? void 0 : _item$badge.status) === 'new') return true;
      }
    }

    return false;
  }

}

function instanceOfBulkActionListSectionArray(actions) {
  const validList = actions.filter(action => {
    return action.items;
  });
  return actions.length === validList.length;
}

function instanceOfBulkActionArray(actions) {
  const validList = actions.filter(action => {
    return !action.items;
  });
  return actions.length === validList.length;
}

function instanceOfMenuGroupDescriptor(action) {
  return 'title' in action;
}

function BulkActions(props) {
  const i18n = hooks.useI18n();
  return /*#__PURE__*/React__default['default'].createElement(BulkActionsInner, Object.assign({}, props, {
    i18n: i18n
  }));
}

exports.BulkActions = BulkActions;
