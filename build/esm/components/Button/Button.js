import React, { useState, useCallback } from 'react';
import { CaretDownMinor, SelectMinor, CaretUpMinor } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../utilities/css.js';
import { handleMouseUpByBlurring } from '../../utilities/focus.js';
import styles from './Button.scss.js';
import { Spinner } from '../Spinner/Spinner.js';
import { Popover } from '../Popover/Popover.js';
import { ActionList } from '../ActionList/ActionList.js';
import { UnstyledButton } from '../UnstyledButton/UnstyledButton.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Icon } from '../Icon/Icon.js';

const DEFAULT_SIZE = 'medium';
function Button({
  id,
  children,
  url,
  disabled,
  external,
  download,
  submit,
  loading,
  pressed,
  accessibilityLabel,
  role,
  ariaControls,
  ariaExpanded,
  ariaDescribedBy,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onTouchStart,
  icon,
  primary,
  outline,
  destructive,
  disclosure,
  plain,
  monochrome,
  removeUnderline,
  size = DEFAULT_SIZE,
  textAlign,
  fullWidth,
  connectedDisclosure
}) {
  const i18n = useI18n();
  const isDisabled = disabled || loading;
  const className = classNames(styles.Button, primary && styles.primary, outline && styles.outline, destructive && styles.destructive, isDisabled && styles.disabled, loading && styles.loading, plain && styles.plain, pressed && !disabled && !url && styles.pressed, monochrome && styles.monochrome, size && size !== DEFAULT_SIZE && styles[variationName('size', size)], textAlign && styles[variationName('textAlign', textAlign)], fullWidth && styles.fullWidth, icon && children == null && styles.iconOnly, connectedDisclosure && styles.connectedDisclosure, removeUnderline && styles.removeUnderline);
  const disclosureMarkup = disclosure ? /*#__PURE__*/React.createElement("span", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.DisclosureIcon, loading && styles.hidden)
  }, /*#__PURE__*/React.createElement(Icon, {
    source: loading ? 'placeholder' : getDisclosureIconSource(disclosure)
  }))) : null;
  const iconSource = isIconSource(icon) ? /*#__PURE__*/React.createElement(Icon, {
    source: loading ? 'placeholder' : icon
  }) : icon;
  const iconMarkup = iconSource ? /*#__PURE__*/React.createElement("span", {
    className: classNames(styles.Icon, loading && styles.hidden)
  }, iconSource) : null;
  const childMarkup = children ? /*#__PURE__*/React.createElement("span", {
    className: classNames(styles.Text, removeUnderline && styles.removeUnderline) // Fixes Safari bug that doesn't re-render button text to correct color
    ,
    key: disabled ? 'text-disabled' : 'text'
  }, children) : null;
  const spinnerSVGMarkup = loading ? /*#__PURE__*/React.createElement("span", {
    className: styles.Spinner
  }, /*#__PURE__*/React.createElement(Spinner, {
    size: "small",
    accessibilityLabel: i18n.translate('Polaris.Button.spinnerAccessibilityLabel')
  })) : null;
  const [disclosureActive, setDisclosureActive] = useState(false);
  const toggleDisclosureActive = useCallback(() => {
    setDisclosureActive(disclosureActive => !disclosureActive);
  }, []);
  let connectedDisclosureMarkup;

  if (connectedDisclosure) {
    const connectedDisclosureClassName = classNames(styles.Button, primary && styles.primary, outline && styles.outline, size && size !== DEFAULT_SIZE && styles[variationName('size', size)], textAlign && styles[variationName('textAlign', textAlign)], destructive && styles.destructive, connectedDisclosure.disabled && styles.disabled, styles.iconOnly, styles.ConnectedDisclosure, monochrome && styles.monochrome);
    const defaultLabel = i18n.translate('Polaris.Button.connectedDisclosureAccessibilityLabel');
    const {
      disabled,
      accessibilityLabel: disclosureLabel = defaultLabel
    } = connectedDisclosure;
    const connectedDisclosureActivator = /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: connectedDisclosureClassName,
      disabled: disabled,
      "aria-label": disclosureLabel,
      "aria-describedby": ariaDescribedBy,
      onClick: toggleDisclosureActive,
      onMouseUp: handleMouseUpByBlurring
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.Icon
    }, /*#__PURE__*/React.createElement(Icon, {
      source: CaretDownMinor
    })));
    connectedDisclosureMarkup = /*#__PURE__*/React.createElement(Popover, {
      active: disclosureActive,
      onClose: toggleDisclosureActive,
      activator: connectedDisclosureActivator,
      preferredAlignment: "right"
    }, /*#__PURE__*/React.createElement(ActionList, {
      items: connectedDisclosure.actions,
      onActionAnyItem: toggleDisclosureActive
    }));
  }

  const commonProps = {
    id,
    className,
    accessibilityLabel,
    ariaDescribedBy,
    role,
    onClick,
    onFocus,
    onBlur,
    onMouseUp: handleMouseUpByBlurring,
    onMouseEnter,
    onTouchStart
  };
  const linkProps = {
    url,
    external,
    download
  };
  const actionProps = {
    submit,
    disabled: isDisabled,
    loading,
    ariaControls,
    ariaExpanded,
    pressed,
    onKeyDown,
    onKeyUp,
    onKeyPress
  };
  const buttonMarkup = /*#__PURE__*/React.createElement(UnstyledButton, Object.assign({}, commonProps, linkProps, actionProps), /*#__PURE__*/React.createElement("span", {
    className: styles.Content
  }, spinnerSVGMarkup, iconMarkup, childMarkup, disclosureMarkup));
  return connectedDisclosureMarkup ? /*#__PURE__*/React.createElement("div", {
    className: styles.ConnectedDisclosureWrapper
  }, buttonMarkup, connectedDisclosureMarkup) : buttonMarkup;
}

function isIconSource(x) {
  return typeof x === 'string' || typeof x === 'object' && x.body || typeof x === 'function';
}

function getDisclosureIconSource(disclosure) {
  if (disclosure === 'select') {
    return SelectMinor;
  }

  return disclosure === 'up' ? CaretUpMinor : CaretDownMinor;
}

export { Button };
