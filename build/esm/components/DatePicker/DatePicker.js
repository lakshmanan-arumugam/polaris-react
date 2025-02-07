import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeftMinor, ArrowRightMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css.js';
import { isDateBefore, isDateAfter, getNextDisplayYear, getNextDisplayMonth, getPreviousDisplayYear, getPreviousDisplayMonth } from '../../utilities/dates.js';
import { monthName } from './utilities.js';
import styles from './DatePicker.scss.js';
import { Month } from './components/Month/Month.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Button } from '../Button/Button.js';

function DatePicker({
  id,
  selected,
  month,
  year,
  allowRange,
  multiMonth,
  disableDatesBefore,
  disableDatesAfter,
  weekStartsOn = 0,
  dayAccessibilityLabelPrefix,
  onMonthChange,
  onChange = noop
}) {
  const i18n = useI18n();
  const [hoverDate, setHoverDate] = useState(undefined);
  const [focusDate, setFocusDate] = useState(undefined);
  useEffect(() => {
    setFocusDate(undefined);
  }, [selected]);
  const handleFocus = useCallback(date => {
    setFocusDate(date);
  }, []);
  const setFocusDateAndHandleMonthChange = useCallback(date => {
    if (onMonthChange) {
      onMonthChange(date.getMonth(), date.getFullYear());
    }

    setHoverDate(date);
    setFocusDate(date);
  }, [onMonthChange]);
  const handleDateSelection = useCallback(range => {
    const {
      end
    } = range;
    setHoverDate(end);
    setFocusDate(new Date(end));
    onChange(range);
  }, [onChange]);
  const handleMonthChangeClick = useCallback((month, year) => {
    if (!onMonthChange) {
      return;
    }

    setFocusDate(undefined);
    onMonthChange(month, year);
  }, [onMonthChange]);
  const handleHover = useCallback(date => {
    setHoverDate(date);
  }, []);
  const handleKeyUp = useCallback(event => {
    const {
      key
    } = event;
    const range = deriveRange(selected);
    const focusedDate = focusDate || range && range.start;

    if (focusedDate == null) {
      return;
    }

    if (key === 'ArrowUp') {
      const previousWeek = new Date(focusedDate);
      previousWeek.setDate(focusedDate.getDate() - 7);

      if (!(disableDatesBefore && isDateBefore(previousWeek, disableDatesBefore))) {
        setFocusDateAndHandleMonthChange(previousWeek);
      }
    }

    if (key === 'ArrowDown') {
      const nextWeek = new Date(focusedDate);
      nextWeek.setDate(focusedDate.getDate() + 7);

      if (!(disableDatesAfter && isDateAfter(nextWeek, disableDatesAfter))) {
        setFocusDateAndHandleMonthChange(nextWeek);
      }
    }

    if (key === 'ArrowRight') {
      const tomorrow = new Date(focusedDate);
      tomorrow.setDate(focusedDate.getDate() + 1);

      if (!(disableDatesAfter && isDateAfter(tomorrow, disableDatesAfter))) {
        setFocusDateAndHandleMonthChange(tomorrow);
      }
    }

    if (key === 'ArrowLeft') {
      const yesterday = new Date(focusedDate);
      yesterday.setDate(focusedDate.getDate() - 1);

      if (!(disableDatesBefore && isDateBefore(yesterday, disableDatesBefore))) {
        setFocusDateAndHandleMonthChange(yesterday);
      }
    }
  }, [disableDatesAfter, disableDatesBefore, focusDate, selected, setFocusDateAndHandleMonthChange]);
  const showNextYear = getNextDisplayYear(month, year);
  const showNextMonth = getNextDisplayMonth(month);
  const showNextToNextYear = getNextDisplayYear(showNextMonth, showNextYear);
  const showNextToNextMonth = getNextDisplayMonth(showNextMonth);
  const showPreviousYear = getPreviousDisplayYear(month, year);
  const showPreviousMonth = getPreviousDisplayMonth(month);
  const previousMonthName = i18n.translate(`Polaris.DatePicker.months.${monthName(showPreviousMonth)}`);
  const nextMonth = multiMonth ? i18n.translate(`Polaris.DatePicker.months.${monthName(showNextToNextMonth)}`) : i18n.translate(`Polaris.DatePicker.months.${monthName(showNextMonth)}`);
  const nextYear = multiMonth ? showNextToNextYear : showNextYear;
  const monthIsSelected = useMemo(() => deriveRange(selected), [selected]);
  const firstDatePickerAccessibilityLabelPrefix = allowRange ? i18n.translate(`Polaris.DatePicker.start`) : dayAccessibilityLabelPrefix;
  const secondDatePickerAccessibilityLabelPrefix = i18n.translate(`Polaris.DatePicker.end`);
  const accessibilityLabelPrefixes = [firstDatePickerAccessibilityLabelPrefix, secondDatePickerAccessibilityLabelPrefix];
  const secondDatePicker = multiMonth ? /*#__PURE__*/React.createElement(Month, {
    onFocus: handleFocus,
    focusedDate: focusDate,
    month: showNextMonth,
    year: showNextYear,
    selected: monthIsSelected,
    hoverDate: hoverDate,
    onChange: handleDateSelection,
    onHover: handleHover,
    disableDatesBefore: disableDatesBefore,
    disableDatesAfter: disableDatesAfter,
    allowRange: allowRange,
    weekStartsOn: weekStartsOn,
    accessibilityLabelPrefixes: accessibilityLabelPrefixes
  }) : null;
  const datePickerClassName = classNames(styles.DatePicker);
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    className: datePickerClassName,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Header
  }, /*#__PURE__*/React.createElement(Button, {
    plain: true,
    icon: ArrowLeftMinor,
    accessibilityLabel: i18n.translate('Polaris.DatePicker.previousMonth', {
      previousMonthName,
      showPreviousYear
    }),
    onClick: () => handleMonthChangeClick(showPreviousMonth, showPreviousYear)
  }), /*#__PURE__*/React.createElement(Button, {
    plain: true,
    icon: ArrowRightMinor,
    accessibilityLabel: i18n.translate('Polaris.DatePicker.nextMonth', {
      nextMonth,
      nextYear
    }),
    onClick: () => handleMonthChangeClick(showNextMonth, showNextYear)
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.MonthLayout
  }, /*#__PURE__*/React.createElement(Month, {
    onFocus: handleFocus,
    focusedDate: focusDate,
    month: month,
    year: year,
    selected: deriveRange(selected),
    hoverDate: hoverDate,
    onChange: handleDateSelection,
    onHover: handleHover,
    disableDatesBefore: disableDatesBefore,
    disableDatesAfter: disableDatesAfter,
    allowRange: allowRange,
    weekStartsOn: weekStartsOn,
    accessibilityLabelPrefixes: accessibilityLabelPrefixes
  }), secondDatePicker));
}

function noop() {}

function handleKeyDown(event) {
  const {
    key
  } = event;

  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    event.preventDefault();
    event.stopPropagation();
  }
}

function deriveRange(selected) {
  return selected instanceof Date ? {
    start: selected,
    end: selected
  } : selected;
}

export { DatePicker };
