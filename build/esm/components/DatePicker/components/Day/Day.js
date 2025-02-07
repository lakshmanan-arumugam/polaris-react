import React, { memo, useRef, useEffect } from 'react';
import { classNames } from '../../../../utilities/css.js';
import { isSameDay } from '../../../../utilities/dates.js';
import { monthName } from '../../utilities.js';
import styles from '../../DatePicker.scss.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';

const Day = /*#__PURE__*/memo(function Day({
  day,
  focused,
  onClick,
  onHover = noop,
  onFocus = noop,
  selected,
  inRange,
  inHoveringRange,
  disabled,
  lastDayOfMonth,
  isLastSelectedDay,
  isFirstSelectedDay,
  isHoveringRight,
  rangeIsDifferent,
  weekday,
  selectedAccessibilityLabelPrefix
}) {
  const i18n = useI18n();
  const dayNode = useRef(null);
  const hoverValue = lastDayOfMonth || day;
  useEffect(() => {
    if (focused && dayNode.current) {
      dayNode.current.focus();
    }
  }, [focused]);

  if (!day) {
    return /*#__PURE__*/React.createElement("td", {
      className: styles.EmptyDayCell,
      onMouseOver: () => onHover(hoverValue)
    });
  }

  const handleClick = onClick && !disabled ? onClick.bind(null, day) : noop;
  const today = isSameDay(new Date(), day);
  const dayCellClassName = classNames(styles.DayCell, selected && styles['DayCell-selected'], (inRange || inHoveringRange) && !disabled && styles['DayCell-inRange'], isLastSelectedDay && styles['DayCell-lastInRange'], isFirstSelectedDay && styles['DayCell-firstInRange'], isHoveringRight && styles['DayCell-hoverRight'], rangeIsDifferent && styles['DayCell-hasRange']);
  const dayClassName = classNames(styles.Day, selected && styles['Day-selected'], disabled && styles['Day-disabled'], today && styles['Day-today'], (inRange || inHoveringRange) && !disabled && styles['Day-inRange'], isLastSelectedDay && styles['Day-lastInRange'], isFirstSelectedDay && styles['Day-firstInRange'], isHoveringRight && styles['Day-hoverRight'], rangeIsDifferent && styles['Day-hasRange']);
  const date = day.getDate();
  const tabIndex = (focused || selected || today || date === 1) && !disabled ? 0 : -1;
  const ariaLabel = [selected && selectedAccessibilityLabelPrefix ? `${selectedAccessibilityLabelPrefix} ` : '', `${today ? i18n.translate('Polaris.DatePicker.today') : ''}`, `${weekday ? weekday : ''} `, `${i18n.translate(`Polaris.DatePicker.months.${monthName(day.getMonth())}`)} `, `${date} `, `${day.getFullYear()}`].join('');
  return /*#__PURE__*/React.createElement("td", {
    className: dayCellClassName
  }, /*#__PURE__*/React.createElement("button", {
    onFocus: () => onFocus(day),
    type: "button",
    ref: dayNode,
    tabIndex: tabIndex,
    className: dayClassName,
    onMouseOver: () => onHover(hoverValue),
    onClick: handleClick,
    "aria-label": ariaLabel,
    "aria-disabled": disabled,
    "aria-pressed": selected
  }, date));
});

function noop() {}

export { Day };
