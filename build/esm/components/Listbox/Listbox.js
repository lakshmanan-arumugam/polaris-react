import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { classNames } from '../../utilities/css.js';
import { useToggle } from '../../utilities/use-toggle.js';
import { Key } from '../../types.js';
import { closestParentMatch } from '../../utilities/closest-parent-match.js';
import { scrollIntoView } from '../../utilities/scroll-into-view.js';
import styles from './Listbox.scss.js';
import { useComboboxListbox } from '../../utilities/combobox/hooks.js';
import { listboxSectionDataSelector } from './components/Section/selectors.js';
import { ListboxContext, WithinListboxContext } from '../../utilities/listbox/context.js';
import { TextOption } from './components/TextOption/TextOption.js';
import { Loading } from './components/Loading/Loading.js';
import { Section } from './components/Section/Section.js';
import { Header } from './components/Header/Header.js';
import { Action } from './components/Action/Action.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { KeypressListener } from '../KeypressListener/KeypressListener.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';
import { Option } from './components/Option/Option.js';

const scrollable = {
  props: {
    'data-polaris-scrollable': true
  },
  selector: '[data-polaris-scrollable]'
};
const LISTBOX_OPTION_SELECTOR = '[data-listbox-option]';
const LISTBOX_OPTION_VALUE_ATTRIBUTE = 'data-listbox-option-value';
const DATA_ATTRIBUTE = 'data-focused';
function Listbox({
  children,
  enableKeyboardControl,
  accessibilityLabel,
  onSelect
}) {
  const listboxClassName = classNames(styles.Listbox);
  const {
    value: keyboardEventsEnabled,
    setTrue: enableKeyboardEvents,
    setFalse: disableKeyboardEvents
  } = useToggle(Boolean(enableKeyboardControl));
  const listId = useUniqueId('Listbox');
  const scrollableRef = useRef(null);
  const listboxRef = useRef(null);
  const [loading, setLoading] = useState();
  const [currentActiveOption, setCurrentActiveOption] = useState();
  const {
    setActiveOptionId,
    setListboxId,
    listboxId,
    textFieldLabelId,
    onOptionSelected,
    onKeyToBottom,
    textFieldFocused
  } = useComboboxListbox();
  const inCombobox = Boolean(setActiveOptionId);
  useEffect(() => {
    if (setListboxId && !listboxId) {
      setListboxId(listId);
    }
  }, [setListboxId, listboxId, listId]);
  useEffect(() => {
    if (!currentActiveOption || !setActiveOptionId) return;
    setActiveOptionId(currentActiveOption.domId);
  }, [currentActiveOption, setActiveOptionId]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleScrollIntoView = useCallback(debounce((option, first) => {
    if (scrollableRef.current) {
      const {
        element
      } = option;
      const focusTarget = first ? closestParentMatch(element, listboxSectionDataSelector.selector) || element : element;
      scrollIntoView(focusTarget, scrollableRef.current);
    }
  }, 15), []);
  const handleChangeActiveOption = useCallback(nextOption => {
    setCurrentActiveOption(currentActiveOption => {
      if (currentActiveOption) {
        currentActiveOption.element.removeAttribute(DATA_ATTRIBUTE);
      }

      if (nextOption) {
        nextOption.element.setAttribute(DATA_ATTRIBUTE, 'true');

        if (scrollableRef.current) {
          const first = getNavigableOptions().findIndex(element => element.id === nextOption.element.id) === 0;
          handleScrollIntoView(nextOption, first);
        }

        return nextOption;
      } else {
        return undefined;
      }
    });
  }, [handleScrollIntoView]);
  useEffect(() => {
    if (listboxRef.current) {
      scrollableRef.current = listboxRef.current.closest(scrollable.selector);
    }
  }, []);
  useEffect(() => {
    if (enableKeyboardControl && !keyboardEventsEnabled) {
      enableKeyboardEvents();
    }
  }, [enableKeyboardControl, keyboardEventsEnabled, enableKeyboardEvents]);
  const onOptionSelect = useCallback(option => {
    handleChangeActiveOption(option);

    if (onOptionSelected) {
      onOptionSelected();
    }

    if (onSelect) onSelect(option.value);
  }, [handleChangeActiveOption, onSelect, onOptionSelected]);
  const listboxContext = useMemo(() => ({
    onOptionSelect,
    setLoading
  }), [onOptionSelect]);

  function findNextValidOption(type) {
    const isUp = type === 'up';
    const navItems = getNavigableOptions();
    let nextElement = currentActiveOption === null || currentActiveOption === void 0 ? void 0 : currentActiveOption.element;
    let count = -1;

    while (count++ < navItems.length) {
      var _nextElement2;

      let nextIndex;

      if (nextElement) {
        var _nextElement;

        const currentId = (_nextElement = nextElement) === null || _nextElement === void 0 ? void 0 : _nextElement.id;
        const currentIndex = navItems.findIndex(currentNavItem => currentNavItem.id === currentId);
        let increment = isUp ? -1 : 1;

        if (currentIndex === 0 && isUp) {
          increment = navItems.length - 1;
        } else if (currentIndex === navItems.length - 1 && !isUp) {
          increment = -(navItems.length - 1);
        }

        nextIndex = currentIndex + increment;
        nextElement = navItems[nextIndex];
      } else {
        nextIndex = isUp ? navItems.length - 1 : 0;
        nextElement = navItems[nextIndex];
      }

      if (((_nextElement2 = nextElement) === null || _nextElement2 === void 0 ? void 0 : _nextElement2.getAttribute('aria-disabled')) === 'true') continue;

      if (nextIndex === navItems.length - 1 && onKeyToBottom) {
        onKeyToBottom();
      }

      return nextElement;
    }

    return null;
  }

  function handleArrow(type, evt) {
    evt.preventDefault();
    const nextValidElement = findNextValidOption(type);
    if (!nextValidElement) return;
    const nextOption = {
      domId: nextValidElement.id,
      value: nextValidElement.getAttribute(LISTBOX_OPTION_VALUE_ATTRIBUTE) || '',
      element: nextValidElement,
      disabled: nextValidElement.getAttribute('aria-disabled') === 'true'
    };
    handleChangeActiveOption(nextOption);
  }

  function handleDownArrow(evt) {
    handleArrow('down', evt);
  }

  function handleUpArrow(evt) {
    handleArrow('up', evt);
  }

  function handleEnter(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (currentActiveOption) {
      onOptionSelect(currentActiveOption);
    }
  }

  function handleFocus() {
    if (enableKeyboardControl) return;
    enableKeyboardEvents();
  }

  function handleBlur(event) {
    event.stopPropagation();

    if (keyboardEventsEnabled) {
      handleChangeActiveOption();
    }

    if (enableKeyboardControl) return;
    disableKeyboardEvents();
  }

  const listeners = keyboardEventsEnabled || textFieldFocused ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.DownArrow,
    handler: handleDownArrow
  }), /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.UpArrow,
    handler: handleUpArrow
  }), /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.Enter,
    handler: handleEnter
  })) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, listeners, /*#__PURE__*/React.createElement(VisuallyHidden, null, /*#__PURE__*/React.createElement("div", {
    "aria-live": "polite"
  }, loading ? loading : null)), /*#__PURE__*/React.createElement(ListboxContext.Provider, {
    value: listboxContext
  }, /*#__PURE__*/React.createElement(WithinListboxContext.Provider, {
    value: true
  }, children ? /*#__PURE__*/React.createElement("ul", {
    tabIndex: 0,
    role: "listbox",
    className: listboxClassName,
    "aria-label": inCombobox ? undefined : accessibilityLabel,
    "aria-labelledby": textFieldLabelId,
    "aria-busy": Boolean(loading),
    "aria-activedescendant": currentActiveOption && currentActiveOption.domId,
    id: listId,
    onFocus: inCombobox ? undefined : handleFocus,
    onBlur: inCombobox ? undefined : handleBlur,
    ref: listboxRef
  }, children) : null)));

  function getNavigableOptions() {
    var _listboxRef$current;

    return [...new Set((_listboxRef$current = listboxRef.current) === null || _listboxRef$current === void 0 ? void 0 : _listboxRef$current.querySelectorAll(LISTBOX_OPTION_SELECTOR))];
  }
}
Listbox.Option = Option;
Listbox.TextOption = TextOption;
Listbox.Loading = Loading;
Listbox.Section = Section;
Listbox.Header = Header;
Listbox.Action = Action;

export { Listbox, scrollable };
