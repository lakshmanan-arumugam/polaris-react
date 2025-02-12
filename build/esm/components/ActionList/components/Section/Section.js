import React from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../ActionList.scss.js';
import { Item } from '../Item/Item.js';

function Section({
  section,
  hasMultipleSections,
  actionRole,
  firstSection,
  onActionAnyItem
}) {
  const handleAction = itemOnAction => {
    return () => {
      if (itemOnAction) {
        itemOnAction();
      }

      if (onActionAnyItem) {
        onActionAnyItem();
      }
    };
  };

  const actionMarkup = section.items.map(({
    content,
    helpText,
    onAction,
    ...item
  }, index) => {
    return /*#__PURE__*/React.createElement(Item, Object.assign({
      key: `${content}-${index}`,
      content: content,
      helpText: helpText,
      role: actionRole,
      onAction: handleAction(onAction)
    }, item));
  });
  const className = section.title ? undefined : styles['Section-withoutTitle'];
  const titleClassName = classNames(styles.Title, firstSection && styles.firstSectionWithTitle);
  const titleMarkup = section.title ? /*#__PURE__*/React.createElement("p", {
    className: titleClassName
  }, section.title) : null;
  let sectionRole;

  switch (actionRole) {
    case 'option':
      sectionRole = 'presentation';
      break;

    case 'menuitem':
      sectionRole = !hasMultipleSections ? 'menu' : 'presentation';
      break;

    default:
      sectionRole = undefined;
      break;
  }

  const sectionMarkup = /*#__PURE__*/React.createElement("div", {
    className: className
  }, titleMarkup, /*#__PURE__*/React.createElement("ul", {
    className: styles.Actions,
    role: sectionRole,
    tabIndex: !hasMultipleSections ? -1 : undefined
  }, actionMarkup));
  return hasMultipleSections ? /*#__PURE__*/React.createElement("li", {
    className: styles.Section,
    role: "presentation"
  }, sectionMarkup) : sectionMarkup;
}

export { Section };
