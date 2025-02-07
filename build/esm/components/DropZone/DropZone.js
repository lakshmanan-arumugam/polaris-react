import React, { useRef, useCallback, useState, useEffect, useMemo, Component, createRef } from 'react';
import debounce from 'lodash/debounce';
import { CircleAlertMajor, UploadMajor } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../utilities/css.js';
import { capitalize } from '../../utilities/capitalize.js';
import { isServer } from '../../utilities/target.js';
import { useComponentDidMount } from '../../utilities/use-component-did-mount.js';
import { useToggle } from '../../utilities/use-toggle.js';
import { DropZoneContext } from './context.js';
import { defaultAllowMultiple, fileAccepted, getDataTransferFiles, createAllowMultipleKey } from './utils/index.js';
import styles from './DropZone.scss.js';
import { FileUpload } from './components/FileUpload/FileUpload.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { Stack } from '../Stack/Stack.js';
import { Icon } from '../Icon/Icon.js';
import { Caption } from '../Caption/Caption.js';
import { TextStyle } from '../TextStyle/TextStyle.js';
import { Labelled } from '../Labelled/Labelled.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';

// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
const DropZone = function DropZone({
  dropOnPage,
  label,
  labelAction,
  labelHidden,
  children,
  disabled = false,
  outline = true,
  accept,
  active,
  overlay = true,
  allowMultiple = defaultAllowMultiple,
  overlayText,
  errorOverlayText,
  id: idProp,
  type = 'file',
  onClick,
  error,
  openFileDialog,
  variableHeight,
  onFileDialogClose,
  customValidator,
  onDrop,
  onDropAccepted,
  onDropRejected,
  onDragEnter,
  onDragOver,
  onDragLeave
}) {
  const node = useRef(null);
  const dragTargets = useRef([]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const adjustSize = useCallback(debounce(() => {
    if (!node.current) {
      return;
    }

    if (variableHeight) {
      setMeasuring(false);
      return;
    }

    let size = 'large';
    const width = node.current.getBoundingClientRect().width;

    if (width < 100) {
      size = 'small';
    } else if (width < 160) {
      size = 'medium';
    }

    setSize(size);
    measuring && setMeasuring(false);
  }, 50, {
    trailing: true
  }), []);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const {
    value: focused,
    setTrue: handleFocus,
    setFalse: handleBlur
  } = useToggle(false);
  const [size, setSize] = useState('large');
  const [measuring, setMeasuring] = useState(true);
  const i18n = useI18n();
  const getValidatedFiles = useCallback(files => {
    const acceptedFiles = [];
    const rejectedFiles = [];
    Array.from(files).forEach(file => {
      !fileAccepted(file, accept) || customValidator && !customValidator(file) ? rejectedFiles.push(file) : acceptedFiles.push(file);
    });

    if (!allowMultiple) {
      acceptedFiles.splice(1, acceptedFiles.length);
      rejectedFiles.push(...acceptedFiles.slice(1));
    }

    return {
      files,
      acceptedFiles,
      rejectedFiles
    };
  }, [accept, allowMultiple, customValidator]);
  const handleDrop = useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    const fileList = getDataTransferFiles(event);
    const {
      files,
      acceptedFiles,
      rejectedFiles
    } = getValidatedFiles(fileList);
    dragTargets.current = [];
    setDragging(false);
    setInternalError(rejectedFiles.length > 0);
    onDrop && onDrop(files, acceptedFiles, rejectedFiles);
    onDropAccepted && acceptedFiles.length && onDropAccepted(acceptedFiles);
    onDropRejected && rejectedFiles.length && onDropRejected(rejectedFiles);
    event.target.value = '';
  }, [disabled, getValidatedFiles, onDrop, onDropAccepted, onDropRejected]);
  const handleDragEnter = useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    const fileList = getDataTransferFiles(event);

    if (event.target && !dragTargets.current.includes(event.target)) {
      dragTargets.current.push(event.target);
    }

    if (dragging) return;
    const {
      rejectedFiles
    } = getValidatedFiles(fileList);
    setDragging(true);
    setInternalError(rejectedFiles.length > 0);
    onDragEnter && onDragEnter();
  }, [disabled, dragging, getValidatedFiles, onDragEnter]);
  const handleDragOver = useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    onDragOver && onDragOver();
  }, [disabled, onDragOver]);
  const handleDragLeave = useCallback(event => {
    event.preventDefault();
    if (disabled) return;
    dragTargets.current = dragTargets.current.filter(el => {
      const compareNode = dropOnPage && !isServer ? document : node.current;
      return el !== event.target && compareNode && compareNode.contains(el);
    });
    if (dragTargets.current.length > 0) return;
    setDragging(false);
    setInternalError(false);
    onDragLeave && onDragLeave();
  }, [dropOnPage, disabled, onDragLeave]);
  useEffect(() => {
    const dropNode = dropOnPage ? document : node.current;
    if (!dropNode) return;
    dropNode.addEventListener('drop', handleDrop);
    dropNode.addEventListener('dragover', handleDragOver);
    dropNode.addEventListener('dragenter', handleDragEnter);
    dropNode.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('resize', adjustSize);
    return () => {
      dropNode.removeEventListener('drop', handleDrop);
      dropNode.removeEventListener('dragover', handleDragOver);
      dropNode.removeEventListener('dragenter', handleDragEnter);
      dropNode.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('resize', adjustSize);
    };
  }, [dropOnPage, handleDrop, handleDragOver, handleDragEnter, handleDragLeave, adjustSize]);
  useComponentDidMount(() => {
    adjustSize();
  });
  const id = useUniqueId('DropZone', idProp);
  const typeSuffix = capitalize(type);
  const allowMultipleKey = createAllowMultipleKey(allowMultiple);
  const overlayTextWithDefault = overlayText === undefined ? i18n.translate(`Polaris.DropZone.${allowMultipleKey}.overlayText${typeSuffix}`) : overlayText;
  const errorOverlayTextWithDefault = errorOverlayText === undefined ? i18n.translate(`Polaris.DropZone.errorOverlayText${typeSuffix}`) : errorOverlayText;
  const labelValue = label || i18n.translate(`Polaris.DropZone.${allowMultipleKey}.label${typeSuffix}`);
  const labelHiddenValue = label ? labelHidden : true;
  const inputAttributes = {
    id,
    accept,
    disabled,
    type: 'file',
    multiple: allowMultiple,
    onChange: handleDrop,
    onFocus: handleFocus,
    onBlur: handleBlur
  };
  const classes = classNames(styles.DropZone, outline && styles.hasOutline, focused && styles.focused, (active || dragging) && styles.isDragging, disabled && styles.isDisabled, (internalError || error) && styles.hasError, !variableHeight && styles[variationName('size', size)], measuring && styles.measuring);
  const dragOverlay = (active || dragging) && !internalError && !error && overlay && overlayMarkup(UploadMajor, 'interactive', overlayTextWithDefault);
  const dragErrorOverlay = dragging && (internalError || error) && overlayMarkup(CircleAlertMajor, 'critical', errorOverlayTextWithDefault);
  const context = useMemo(() => ({
    disabled,
    focused,
    size,
    type: type || 'file',
    measuring,
    allowMultiple
  }), [disabled, focused, measuring, size, type, allowMultiple]);
  return /*#__PURE__*/React.createElement(DropZoneContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(Labelled, {
    id: id,
    label: labelValue,
    action: labelAction,
    labelHidden: labelHiddenValue
  }, /*#__PURE__*/React.createElement("div", {
    ref: node,
    className: classes,
    "aria-disabled": disabled,
    onClick: handleClick,
    onDragStart: stopEvent
  }, dragOverlay, dragErrorOverlay, /*#__PURE__*/React.createElement(VisuallyHidden, null, /*#__PURE__*/React.createElement(DropZoneInput, Object.assign({}, inputAttributes, {
    openFileDialog: openFileDialog,
    onFileDialogClose: onFileDialogClose
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles.Container
  }, children))));

  function overlayMarkup(icon, color, text) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.Overlay
    }, /*#__PURE__*/React.createElement(Stack, {
      vertical: true,
      spacing: "tight"
    }, size === 'small' && /*#__PURE__*/React.createElement(Icon, {
      source: icon,
      color: color
    }), (size === 'medium' || size === 'large') && /*#__PURE__*/React.createElement(Caption, null, /*#__PURE__*/React.createElement(TextStyle, {
      variation: "strong"
    }, text))));
  }

  function open() {
    const fileInputNode = node.current && node.current.querySelector(`#${id}`);
    fileInputNode && fileInputNode instanceof HTMLElement && fileInputNode.click();
  }

  function handleClick(event) {
    if (disabled) return;
    return onClick ? onClick(event) : open();
  }
};

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

DropZone.FileUpload = FileUpload;

// Due to security reasons, browsers do not allow file inputs to be opened artificially.
// For example `useEffect(() => { ref.click() })`. Oddly enough react class-based components bi-pass this.
class DropZoneInput extends Component {
  constructor(...args) {
    super(...args);
    this.fileInputNode = /*#__PURE__*/createRef();

    this.triggerFileDialog = () => {
      this.open();
      this.props.onFileDialogClose && this.props.onFileDialogClose();
    };

    this.open = () => {
      if (!this.fileInputNode.current) return;
      this.fileInputNode.current.click();
    };
  }

  componentDidMount() {
    this.props.openFileDialog && this.triggerFileDialog();
  }

  componentDidUpdate() {
    this.props.openFileDialog && this.triggerFileDialog();
  }

  render() {
    const {
      openFileDialog,
      onFileDialogClose,
      ...inputProps
    } = this.props;
    return /*#__PURE__*/React.createElement("input", Object.assign({}, inputProps, {
      ref: this.fileInputNode,
      autoComplete: "off"
    }));
  }

}

export { DropZone };
