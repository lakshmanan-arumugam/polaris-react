import React, { useContext } from 'react';
import { classNames, variationName } from '../../utilities/css.js';
import { WithinFilterContext } from '../../utilities/within-filter-context.js';
import styles from './Badge.scss.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';

const PROGRESS_LABELS = {
  incomplete: 'incomplete',
  partiallyComplete: 'partiallyComplete',
  complete: 'complete'
};
const STATUS_LABELS = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
  attention: 'attention',
  new: 'new'
};
const DEFAULT_SIZE = 'medium';
function Badge({
  children,
  status,
  progress,
  size = DEFAULT_SIZE,
  statusAndProgressLabelOverride
}) {
  const i18n = useI18n();
  const withinFilter = useContext(WithinFilterContext);
  const className = classNames(styles.Badge, status && styles[variationName('status', status)], progress && styles[variationName('progress', progress)], size && size !== DEFAULT_SIZE && styles[variationName('size', size)], withinFilter && styles.withinFilter);
  let progressLabel = '';

  switch (progress) {
    case PROGRESS_LABELS.incomplete:
      progressLabel = i18n.translate('Polaris.Badge.PROGRESS_LABELS.incomplete');
      break;

    case PROGRESS_LABELS.partiallyComplete:
      progressLabel = i18n.translate('Polaris.Badge.PROGRESS_LABELS.partiallyComplete');
      break;

    case PROGRESS_LABELS.complete:
      progressLabel = i18n.translate('Polaris.Badge.PROGRESS_LABELS.complete');
      break;
  }

  let statusLabel = '';

  switch (status) {
    case STATUS_LABELS.info:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.info');
      break;

    case STATUS_LABELS.success:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.success');
      break;

    case STATUS_LABELS.warning:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.warning');
      break;

    case STATUS_LABELS.critical:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.critical');
      break;

    case STATUS_LABELS.attention:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.attention');
      break;

    case STATUS_LABELS.new:
      statusLabel = i18n.translate('Polaris.Badge.STATUS_LABELS.new');
      break;
  }

  const accessibilityLabel = statusAndProgressLabelOverride ? statusAndProgressLabelOverride : i18n.translate('Polaris.Badge.progressAndStatus', {
    progressLabel,
    statusLabel
  });
  const hasAccessibilityLabel = progressLabel || statusLabel || statusAndProgressLabelOverride;
  let accessibilityMarkup = hasAccessibilityLabel && /*#__PURE__*/React.createElement(VisuallyHidden, null, accessibilityLabel);

  if (progressLabel) {
    accessibilityMarkup = /*#__PURE__*/React.createElement("span", {
      className: styles.Pip
    }, accessibilityMarkup);
  }

  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, accessibilityMarkup, children);
}

export { Badge };
