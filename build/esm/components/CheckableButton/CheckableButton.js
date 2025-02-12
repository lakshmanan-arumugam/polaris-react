import React, { useRef, useContext, useEffect } from 'react';
import { classNames } from '../../utilities/css.js';
import styles from './CheckableButton.scss.js';
import { ResourceListContext } from '../../utilities/resource-list/context.js';
import { Checkbox } from '../Checkbox/Checkbox.js';

function CheckableButton({
  accessibilityLabel,
  label = '',
  onToggleAll,
  selected,
  selectMode,
  plain,
  measuring,
  disabled,
  smallScreen
}) {
  const checkBoxRef = useRef(null);
  const {
    registerCheckableButtons
  } = useContext(ResourceListContext);
  let currentKey = 'bulkLg';

  if (plain) {
    currentKey = 'plain';
  } else if (smallScreen) {
    currentKey = 'bulkSm';
  }

  useEffect(() => {
    if (checkBoxRef.current && registerCheckableButtons) {
      registerCheckableButtons(currentKey, checkBoxRef.current);
    }
  }, [currentKey, registerCheckableButtons]);
  const className = plain ? classNames(styles.CheckableButton, styles['CheckableButton-plain']) : classNames(styles.CheckableButton, selectMode && styles['CheckableButton-selectMode'], selected && styles['CheckableButton-selected'], measuring && styles['CheckableButton-measuring']);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    onClick: onToggleAll
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Checkbox
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: accessibilityLabel,
    labelHidden: true,
    checked: selected,
    disabled: disabled,
    onChange: onToggleAll,
    ref: checkBoxRef
  })), /*#__PURE__*/React.createElement("span", {
    className: styles.Label
  }, label));
}

export { CheckableButton };
