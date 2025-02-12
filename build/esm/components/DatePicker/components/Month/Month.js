import React, { useMemo, useCallback } from 'react';
import { classNames } from '../../../../utilities/css.js';
import { getWeeksForMonth, getOrderedWeekdays, getNewRange, isDateBefore, isDateAfter, isSameDay, dateIsSelected, dateIsInRange } from '../../../../utilities/dates.js';
import styles from '../../DatePicker.scss.js';
import { weekdayName, monthName } from '../../utilities.js';
import { Weekday } from '../Weekday/Weekday.js';
import { Day } from '../Day/Day.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';

function Month({
  focusedDate,
  selected,
  hoverDate,
  disableDatesBefore,
  disableDatesAfter,
  allowRange,
  onChange = noop,
  onHover = noop,
  onFocus = noop,
  month,
  year,
  weekStartsOn,
  accessibilityLabelPrefixes
}) {
  const i18n = useI18n();
  const isInHoveringRange = allowRange ? hoveringDateIsInRange : () => false;
  const now = new Date();
  const current = now.getMonth() === month && now.getFullYear() === year;
  const className = classNames(styles.Title, current && styles['Month-current']);
  const weeks = useMemo(() => getWeeksForMonth(month, year, weekStartsOn), [month, weekStartsOn, year]);
  const weekdays = getOrderedWeekdays(weekStartsOn).map(weekday => /*#__PURE__*/React.createElement(Weekday, {
    key: weekday,
    title: i18n.translate(`Polaris.DatePicker.daysAbbreviated.${weekdayName(weekday)}`),
    label: weekdayLabel(weekday),
    current: current && new Date().getDay() === weekday
  }));
  const handleDateClick = useCallback(selectedDate => {
    onChange(getNewRange(allowRange ? selected : undefined, selectedDate));
  }, [allowRange, onChange, selected]);
  const lastDayOfMonth = useMemo(() => new Date(year, month + 1, 0), [month, year]);

  function renderWeek(day, dayIndex) {
    if (day == null) {
      return /*#__PURE__*/React.createElement(Day, {
        key: dayIndex,
        onHover: onHover,
        lastDayOfMonth: lastDayOfMonth
      });
    }

    const disabled = disableDatesBefore && isDateBefore(day, disableDatesBefore) || disableDatesAfter && isDateAfter(day, disableDatesAfter);
    const isFirstSelectedDay = allowRange && selected && isDateStart(day, selected);
    const isLastSelectedDay = allowRange && selected && (!isSameDay(selected.start, selected.end) && isDateEnd(day, selected) || hoverDate && isSameDay(selected.start, selected.end) && isDateAfter(hoverDate, selected.start) && isSameDay(day, hoverDate) && !isFirstSelectedDay);
    const rangeIsDifferent = !(selected && isSameDay(selected.start, selected.end));
    const isHoveringRight = hoverDate && isDateBefore(day, hoverDate);
    const [firstAccessibilityLabelPrefix, lastAccessibilityLabelPrefix] = accessibilityLabelPrefixes;
    let accessibilityLabelPrefix;

    if (allowRange && isFirstSelectedDay || !allowRange && firstAccessibilityLabelPrefix) {
      accessibilityLabelPrefix = firstAccessibilityLabelPrefix;
    } else if (allowRange && isLastSelectedDay) {
      accessibilityLabelPrefix = lastAccessibilityLabelPrefix;
    }

    return /*#__PURE__*/React.createElement(Day, {
      selectedAccessibilityLabelPrefix: accessibilityLabelPrefix,
      weekday: weekdayLabel(dayIndex),
      focused: focusedDate != null && isSameDay(day, focusedDate),
      day: day,
      key: dayIndex,
      onFocus: onFocus,
      onClick: handleDateClick,
      onHover: onHover,
      selected: selected != null && dateIsSelected(day, selected),
      inRange: selected != null && dateIsInRange(day, selected),
      disabled: disabled,
      inHoveringRange: selected != null && hoverDate != null && isInHoveringRange(day, selected, hoverDate),
      isLastSelectedDay: isLastSelectedDay,
      isFirstSelectedDay: isFirstSelectedDay,
      isHoveringRight: isHoveringRight,
      rangeIsDifferent: rangeIsDifferent
    });
  }

  const weeksMarkup = weeks.map((week, index) => /*#__PURE__*/React.createElement("tr", {
    className: styles.Week,
    key: index
  }, week.map(renderWeek)));
  return /*#__PURE__*/React.createElement("div", {
    className: styles.MonthContainer
  }, /*#__PURE__*/React.createElement("table", {
    role: "grid",
    className: styles.Month
  }, /*#__PURE__*/React.createElement("caption", {
    className: className
  }, i18n.translate(`Polaris.DatePicker.months.${monthName(month)}`), ' ', year), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: styles.WeekHeadings
  }, weekdays)), /*#__PURE__*/React.createElement("tbody", null, weeksMarkup)));

  function weekdayLabel(weekday) {
    return i18n.translate(`Polaris.DatePicker.days.${weekdayName(weekday)}`);
  }
}

function noop() {}

function hoveringDateIsInRange(day, range, hoverEndDate) {
  if (day == null) {
    return false;
  }

  const {
    start,
    end
  } = range;
  return Boolean(isSameDay(start, end) && day > start && day <= hoverEndDate);
}

function isDateEnd(day, range) {
  if (day == null) return false;
  const {
    end
  } = range;
  return Boolean(end && isSameDay(end, day));
}

function isDateStart(day, range) {
  if (day == null) return false;
  const {
    start
  } = range;
  return Boolean(start && isSameDay(start, day));
}

export { Month };
