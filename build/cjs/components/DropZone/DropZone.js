'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var capitalize = require('../../utilities/capitalize.js');
var target = require('../../utilities/target.js');
var useComponentDidMount = require('../../utilities/use-component-did-mount.js');
var useToggle = require('../../utilities/use-toggle.js');
var context = require('./context.js');
var index = require('./utils/index.js');
var DropZone$1 = require('./DropZone.scss.js');
var FileUpload = require('./components/FileUpload/FileUpload.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/unique-id/hooks.js');
var Stack = require('../Stack/Stack.js');
var Icon = require('../Icon/Icon.js');
var Caption = require('../Caption/Caption.js');
var TextStyle = require('../TextStyle/TextStyle.js');
var Labelled = require('../Labelled/Labelled.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

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
  allowMultiple = index.defaultAllowMultiple,
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
  const node = React.useRef(null);
  const dragTargets = React.useRef([]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const adjustSize = React.useCallback(debounce__default['default'](() => {
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
  const [dragging, setDragging] = React.useState(false);
  const [internalError, setInternalError] = React.useState(false);
  const {
    value: focused,
    setTrue: handleFocus,
    setFalse: handleBlur
  } = useToggle.useToggle(false);
  const [size, setSize] = React.useState('large');
  const [measuring, setMeasuring] = React.useState(true);
  const i18n = hooks.useI18n();
  const getValidatedFiles = React.useCallback(files => {
    const acceptedFiles = [];
    const rejectedFiles = [];
    Array.from(files).forEach(file => {
      !index.fileAccepted(file, accept) || customValidator && !customValidator(file) ? rejectedFiles.push(file) : acceptedFiles.push(file);
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
  const handleDrop = React.useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    const fileList = index.getDataTransferFiles(event);
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
  const handleDragEnter = React.useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    const fileList = index.getDataTransferFiles(event);

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
  const handleDragOver = React.useCallback(event => {
    stopEvent(event);
    if (disabled) return;
    onDragOver && onDragOver();
  }, [disabled, onDragOver]);
  const handleDragLeave = React.useCallback(event => {
    event.preventDefault();
    if (disabled) return;
    dragTargets.current = dragTargets.current.filter(el => {
      const compareNode = dropOnPage && !target.isServer ? document : node.current;
      return el !== event.target && compareNode && compareNode.contains(el);
    });
    if (dragTargets.current.length > 0) return;
    setDragging(false);
    setInternalError(false);
    onDragLeave && onDragLeave();
  }, [dropOnPage, disabled, onDragLeave]);
  React.useEffect(() => {
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
  useComponentDidMount.useComponentDidMount(() => {
    adjustSize();
  });
  const id = hooks$1.useUniqueId('DropZone', idProp);
  const typeSuffix = capitalize.capitalize(type);
  const allowMultipleKey = index.createAllowMultipleKey(allowMultiple);
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
  const classes = css.classNames(DropZone$1['default'].DropZone, outline && DropZone$1['default'].hasOutline, focused && DropZone$1['default'].focused, (active || dragging) && DropZone$1['default'].isDragging, disabled && DropZone$1['default'].isDisabled, (internalError || error) && DropZone$1['default'].hasError, !variableHeight && DropZone$1['default'][css.variationName('size', size)], measuring && DropZone$1['default'].measuring);
  const dragOverlay = (active || dragging) && !internalError && !error && overlay && overlayMarkup(polarisIcons.UploadMajor, 'interactive', overlayTextWithDefault);
  const dragErrorOverlay = dragging && (internalError || error) && overlayMarkup(polarisIcons.CircleAlertMajor, 'critical', errorOverlayTextWithDefault);
  const context$1 = React.useMemo(() => ({
    disabled,
    focused,
    size,
    type: type || 'file',
    measuring,
    allowMultiple
  }), [disabled, focused, measuring, size, type, allowMultiple]);
  return /*#__PURE__*/React__default['default'].createElement(context.DropZoneContext.Provider, {
    value: context$1
  }, /*#__PURE__*/React__default['default'].createElement(Labelled.Labelled, {
    id: id,
    label: labelValue,
    action: labelAction,
    labelHidden: labelHiddenValue
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    ref: node,
    className: classes,
    "aria-disabled": disabled,
    onClick: handleClick,
    onDragStart: stopEvent
  }, dragOverlay, dragErrorOverlay, /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, /*#__PURE__*/React__default['default'].createElement(DropZoneInput, Object.assign({}, inputAttributes, {
    openFileDialog: openFileDialog,
    onFileDialogClose: onFileDialogClose
  }))), /*#__PURE__*/React__default['default'].createElement("div", {
    className: DropZone$1['default'].Container
  }, children))));

  function overlayMarkup(icon, color, text) {
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: DropZone$1['default'].Overlay
    }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
      vertical: true,
      spacing: "tight"
    }, size === 'small' && /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
      source: icon,
      color: color
    }), (size === 'medium' || size === 'large') && /*#__PURE__*/React__default['default'].createElement(Caption.Caption, null, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
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

DropZone.FileUpload = FileUpload.FileUpload;

// Due to security reasons, browsers do not allow file inputs to be opened artificially.
// For example `useEffect(() => { ref.click() })`. Oddly enough react class-based components bi-pass this.
class DropZoneInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.fileInputNode = /*#__PURE__*/React.createRef();

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
    return /*#__PURE__*/React__default['default'].createElement("input", Object.assign({}, inputProps, {
      ref: this.fileInputNode,
      autoComplete: "off"
    }));
  }

}

exports.DropZone = DropZone;
