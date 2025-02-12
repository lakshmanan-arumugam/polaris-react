import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import styles from './Actions.scss.js';
import { MenuGroup } from '../MenuGroup/MenuGroup.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { SecondaryAction } from '../SecondaryAction/SecondaryAction.js';
import { EventListener } from '../../../EventListener/EventListener.js';
import { ButtonGroup } from '../../../ButtonGroup/ButtonGroup.js';

const ACTION_SPACING = 8;
function Actions({
  actions = [],
  groups = []
}) {
  const i18n = useI18n();
  const actionsLayoutRef = useRef(null);
  const menuGroupWidthRef = useRef(0);
  const availableWidthRef = useRef(0);
  const actionsAndGroupsLengthRef = useRef(0);
  const timesMeasured = useRef(0);
  const actionWidthsRef = useRef([]);
  const [activeMenuGroup, setActiveMenuGroup] = useState(undefined);
  const [measuredActions, setMeasuredActions] = useState({
    showable: [],
    rolledUp: []
  });
  const defaultRollupGroup = {
    title: i18n.translate('Polaris.ActionMenu.Actions.moreActions'),
    actions: []
  };
  const lastMenuGroup = [...groups].pop();
  const lastMenuGroupWidth = [...actionWidthsRef.current].pop() || 0;
  const handleActionsOffsetWidth = useCallback(width => {
    actionWidthsRef.current = [...actionWidthsRef.current, width];
  }, []);
  const handleMenuGroupToggle = useCallback(group => setActiveMenuGroup(activeMenuGroup ? undefined : group), [activeMenuGroup]);
  const handleMenuGroupClose = useCallback(() => setActiveMenuGroup(undefined), []);
  const updateActions = useCallback(() => {
    let actionsAndGroups = [...actions, ...groups];

    if (groups.length > 0) {
      // We don't want to include actions from the last group
      // since it is always rendered with its own actions
      actionsAndGroups = [...actionsAndGroups].slice(0, actionsAndGroups.length - 1);
    }

    const showable = actionsAndGroups.slice(0, measuredActions.showable.length);
    const rolledUp = actionsAndGroups.slice(measuredActions.showable.length, actionsAndGroups.length);
    setMeasuredActions({
      showable,
      rolledUp
    });
  }, [actions, groups, measuredActions.showable.length]);
  const measureActions = useCallback(() => {
    if (actionWidthsRef.current.length === 0 || availableWidthRef.current === 0) {
      return;
    }

    const actionsAndGroups = [...actions, ...groups];

    if (actionsAndGroups.length === 1) {
      setMeasuredActions({
        showable: actionsAndGroups,
        rolledUp: []
      });
      return;
    }

    let currentAvailableWidth = availableWidthRef.current;
    let newShowableActions = [];
    let newRolledUpActions = [];
    actionsAndGroups.forEach((action, index) => {
      const canFitAction = actionWidthsRef.current[index] + menuGroupWidthRef.current + ACTION_SPACING + lastMenuGroupWidth <= currentAvailableWidth;

      if (canFitAction) {
        currentAvailableWidth -= actionWidthsRef.current[index] + ACTION_SPACING * 2;
        newShowableActions = [...newShowableActions, action];
      } else {
        currentAvailableWidth = 0; // Find last group if it exists and always render it as a rolled up action below

        if (action === lastMenuGroup) return;
        newRolledUpActions = [...newRolledUpActions, action];
      }
    });
    setMeasuredActions({
      showable: newShowableActions,
      rolledUp: newRolledUpActions
    });
    timesMeasured.current += 1;
    actionsAndGroupsLengthRef.current = actionsAndGroups.length;
  }, [actions, groups, lastMenuGroup, lastMenuGroupWidth]);
  const handleResize = useMemo(() => debounce(() => {
    if (!actionsLayoutRef.current) return;
    availableWidthRef.current = actionsLayoutRef.current.offsetWidth; // Set timesMeasured to 0 to allow re-measuring

    timesMeasured.current = 0;
    measureActions();
  }, 50, {
    leading: false,
    trailing: true
  }), [measureActions]);
  useEffect(() => {
    if (!actionsLayoutRef.current) {
      return;
    }

    availableWidthRef.current = actionsLayoutRef.current.offsetWidth;

    if ( // Allow measuring twice
    // This accounts for the initial paint and re-flow
    timesMeasured.current >= 2 && [...actions, ...groups].length === actionsAndGroupsLengthRef.current) {
      updateActions();
      return;
    }

    measureActions();
  }, [actions, groups, measureActions, updateActions]);
  const actionsMarkup = actions.map(action => {
    if (measuredActions.showable.length > 0 || measuredActions.rolledUp.includes(action)) return null;
    const {
      content,
      onAction,
      ...rest
    } = action;
    return /*#__PURE__*/React.createElement(SecondaryAction, Object.assign({
      key: content,
      onClick: onAction
    }, rest, {
      getOffsetWidth: handleActionsOffsetWidth
    }), content);
  });
  const rollUppableActionsMarkup = measuredActions.showable.length > 0 ? measuredActions.showable.map(action => action.content && /*#__PURE__*/React.createElement(SecondaryAction, Object.assign({
    key: action.content
  }, action, {
    getOffsetWidth: handleActionsOffsetWidth
  }), action.content)) : null;
  const filteredGroups = [...groups, defaultRollupGroup].filter(group => {
    return groups.length === 0 ? group : group === lastMenuGroup || !measuredActions.rolledUp.some(rolledUpGroup => isMenuGroup(rolledUpGroup) && rolledUpGroup.title === group.title);
  });
  const groupsMarkup = filteredGroups.map(group => {
    const {
      title,
      actions: groupActions,
      ...rest
    } = group;
    const isDefaultGroup = group === defaultRollupGroup;
    const isLastMenuGroup = group === lastMenuGroup;
    const finalRolledUpActions = measuredActions.rolledUp.reduce((memo, action) => {
      memo.push(...(isMenuGroup(action) ? action.actions : [action]));
      return memo;
    }, []);

    if (!isDefaultGroup && !isLastMenuGroup) {
      // Render a normal MenuGroup with just its actions
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: groupActions
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    } else if (!isDefaultGroup && isLastMenuGroup) {
      // render the last, rollup group with its actions and finalRolledupActions
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: [...finalRolledUpActions, ...groupActions]
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    } else if (isDefaultGroup && groups.length === 0 && finalRolledUpActions.length) {
      // Render the default group to rollup into if one does not exist
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: finalRolledUpActions
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    }
  });
  const groupedActionsMarkup = /*#__PURE__*/React.createElement(ButtonGroup, {
    spacing: "extraTight"
  }, rollUppableActionsMarkup, actionsMarkup, groupsMarkup);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.ActionsLayout,
    ref: actionsLayoutRef
  }, groupedActionsMarkup, /*#__PURE__*/React.createElement(EventListener, {
    event: "resize",
    handler: handleResize
  }));
}

function isMenuGroup(actionOrMenuGroup) {
  return 'title' in actionOrMenuGroup;
}

export { Actions };
