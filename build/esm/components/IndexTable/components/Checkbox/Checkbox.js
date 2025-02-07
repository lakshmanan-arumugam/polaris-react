import React, { memo, useContext, Fragment, useRef, useCallback, useEffect } from 'react';
import { classNames } from '../../../../utilities/css.js';
import { setRootProperty } from '../../../../utilities/set-root-property.js';
import styles$1 from '../../IndexTable.scss.js';
import styles from './Checkbox.scss.js';
import { useIndexValue } from '../../../../utilities/index-provider/hooks.js';
import { RowContext } from '../../../../utilities/index-table/context.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { Checkbox as Checkbox$1 } from '../../../Checkbox/Checkbox.js';

const Checkbox = /*#__PURE__*/memo(function Checkbox() {
  const i18n = useI18n();
  const {
    resourceName,
    condensed
  } = useIndexValue();
  const {
    itemId,
    selected,
    onInteraction
  } = useContext(RowContext);
  const wrapperClassName = classNames(styles.Wrapper, condensed ? styles.condensed : styles.expanded);
  const Wrapper = condensed ? Fragment : CheckboxWrapper;
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement("div", {
    className: styles.TableCellContentContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: wrapperClassName,
    onClick: onInteraction,
    onKeyUp: noop
  }, /*#__PURE__*/React.createElement(Checkbox$1, {
    id: itemId,
    label: i18n.translate('Polaris.IndexTable.selectItem', {
      resourceName: resourceName.singular
    }),
    labelHidden: true,
    checked: selected
  }))));
});
function CheckboxWrapper({
  children
}) {
  const checkboxNode = useRef(null);
  const handleResize = useCallback(() => {
    if (!checkboxNode.current) return;
    const {
      width
    } = checkboxNode.current.getBoundingClientRect();
    setRootProperty('--p-checkbox-offset', `${width}px`, null);
  }, []);
  useEffect(() => {
    handleResize();
  }, [handleResize]);
  useEffect(() => {
    if (!checkboxNode.current) return;
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  const checkboxClassName = classNames(styles$1.TableCell, styles$1['TableCell-first']);
  return /*#__PURE__*/React.createElement("td", {
    className: checkboxClassName,
    ref: checkboxNode
  }, children);
}

function noop() {}

export { Checkbox, CheckboxWrapper };
