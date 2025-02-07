import React from 'react';
import { ChevronLeftMinor, ChevronRightMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../DataTable.scss.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { Button } from '../../../Button/Button.js';

function Navigation({
  columnVisibilityData,
  isScrolledFarthestLeft,
  isScrolledFarthestRight,
  navigateTableLeft,
  navigateTableRight
}) {
  const i18n = useI18n();
  const pipMarkup = columnVisibilityData.map((column, index) => {
    const className = classNames(styles.Pip, column.isVisible && styles['Pip-visible']);
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      key: `pip-${index}`
    });
  });
  const leftA11yLabel = i18n.translate('Polaris.DataTable.navAccessibilityLabel', {
    direction: 'left'
  });
  const rightA11yLabel = i18n.translate('Polaris.DataTable.navAccessibilityLabel', {
    direction: 'right'
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles.Navigation
  }, /*#__PURE__*/React.createElement(Button, {
    plain: true,
    icon: ChevronLeftMinor,
    disabled: isScrolledFarthestLeft,
    accessibilityLabel: leftA11yLabel,
    onClick: navigateTableLeft
  }), pipMarkup, /*#__PURE__*/React.createElement(Button, {
    plain: true,
    icon: ChevronRightMinor,
    disabled: isScrolledFarthestRight,
    accessibilityLabel: rightA11yLabel,
    onClick: navigateTableRight
  }));
}

export { Navigation };
