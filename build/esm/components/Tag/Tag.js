import React from 'react';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css.js';
import { handleMouseUpByBlurring } from '../../utilities/focus.js';
import styles from './Tag.scss.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Icon } from '../Icon/Icon.js';

function Tag({
  children,
  disabled = false,
  onClick,
  onRemove,
  accessibilityLabel,
  url
}) {
  const i18n = useI18n();
  const segmented = onRemove && url;
  const className = classNames(styles.Tag, disabled && styles.disabled, onClick && styles.clickable, onRemove && styles.removable, url && !disabled && styles.linkable, segmented && styles.segmented);

  if (onClick) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: disabled,
      className: className,
      onClick: onClick
    }, children);
  }

  let tagTitle = accessibilityLabel;

  if (!tagTitle) {
    tagTitle = typeof children === 'string' ? children : undefined;
  }

  const ariaLabel = i18n.translate('Polaris.Tag.ariaLabel', {
    children: tagTitle || ''
  });
  const removeButton = onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": ariaLabel,
    className: classNames(styles.Button, segmented && styles.segmented),
    onClick: onRemove,
    onMouseUp: handleMouseUpByBlurring,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(Icon, {
    source: CancelSmallMinor
  })) : null;
  const tagContent = url && !disabled ? /*#__PURE__*/React.createElement("a", {
    className: classNames(styles.Link, segmented && styles.segmented),
    href: url
  }, /*#__PURE__*/React.createElement("span", {
    title: tagTitle,
    className: styles.LinkText
  }, children)) : /*#__PURE__*/React.createElement("span", {
    title: tagTitle,
    className: styles.TagText
  }, children);
  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, tagContent, removeButton);
}

export { Tag };
